import { CommonFields, Interactable, ViewTracking } from './common';

export const Document = {
    className: "Document",
	fields: Object.assign(
        {},
        CommonFields,
        {
            author: {
                type: "Pointer",
                targetClass: "_User",
                required: true
            },
            team: {
                type: "Pointer",
                targetClass: "Team",
                required: true
            },
            title: {
                type: "String",
                required: true
            },
            upload: {
                type: "File",
            },
            url: {
                type: "String",
            }
        },
        Interactable,
        ViewTracking,
    ),
    classLevelPermissions: {
        find: {
            '*': true
        },
        count: {},
        get: {
            '*': true
        },
        create: {},
        update: {},
        delete: {},
        addField: {},
        protectedFields: {}
    },
    indexes: {
    }
}
