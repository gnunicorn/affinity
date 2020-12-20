/* global Parse */

const fetchModel = require('./common').fetchModel;

const GenericObjectParams = {
    fields: {
        className: {
            required: true,
            type: String,
        },
        id: {
            required: true,
            type: String,
        }
    },
    requiredUser: true
}

const ReactionsParams = {
    fields: Object.assign({
            reaction: {
                required: true,
                type: String,
                options: (val) => {
                    // checking for emoji only strings
                    // includes modifiers
                    return !!val.match(/^\p{Emoji}+$/u)
                }
            }
        }, GenericObjectParams.fields),
    requiredUser: true
};

const F_LIKED_BY = "likedBy";
const F_LIKES_COUNT = "likesCount";
const F_REACTIONS = "reactions";

Parse.Cloud.define("react", async (request) => {
    const model = await fetchModel(request);
    const user = request.user;
    const reaction = request.params.reaction;
    const reacts = model.get(F_REACTIONS) || {};
    if (!reacts[reaction]) {
        reacts[reaction] = [user.id];
    } else if (reacts[reaction].indexOf(user.id) === -1) {
        reacts[reaction].push(user.id)
    } else {
        // already recorded
        return model
    }

    model.set(F_REACTIONS, reacts);
    await model.save(null, { useMasterKey: true });
    return model

  },
ReactionsParams);

Parse.Cloud.define("unreact", async (request) => {
    const model = await fetchModel(request);
    const user = request.user;
    const reaction = request.params.reaction;
    const reacts = model.get(F_REACTIONS);
    if (!reacts || !reacts[reaction]) {
        return model
    }

    const idx = reacts[reaction].indexOf(user.id);
    if (idx !== -1) {
        reacts[reaction].pop(idx);
        if (reacts[reaction].length === 0) {
            delete reacts[reaction];
        }
        model.set(F_REACTIONS, reacts);
        await model.save(null, { useMasterKey: true });
    }

    return model
  },
ReactionsParams);

Parse.Cloud.define("like", async (request) => {
    const model = await fetchModel(request);
    const user = request.user;
    if (!model.get(F_LIKED_BY)) {
        model.set(F_LIKED_BY, [user.id]);
        model.set(F_LIKES_COUNT, 1);
    } else {
        model.addUnique(F_LIKED_BY, user.id);
        model.set(F_LIKES_COUNT, model.get(F_LIKED_BY).length);
    }
    await model.save(null, { useMasterKey: true });
    return model
  },
  GenericObjectParams
);

Parse.Cloud.define("unlike", async (request) => {
    const model = await fetchModel(request);
    const user = request.user;
    const likedBy = model.get(F_LIKED_BY);
    if (!!likedBy) {
        const idx = likedBy.indexOf(user.id);
        if (idx !== -1) {
            likedBy.pop(idx);
            model.set(F_LIKES_COUNT, likedBy.length);
            model.set(F_LIKED_BY, likedBy);
            await model.save(null, { useMasterKey: true });
        }
    }
    return model
  },
  GenericObjectParams
);
