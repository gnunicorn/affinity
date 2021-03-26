/// <reference types="Cypress" />

describe("Posting to the feed as regular User", () => {
  beforeEach(() => {
    cy.loggedInAs("clara");
  });

  it("Posts a simple message from ipad", () => {
    cy.viewport("ipad-2", "landscape");
    const testStr = `Whatever, dude ${Math.abs(Math.random() * 1000000)}!`;
    cy.visit("/feed");
    cy.get("[data-cy=openNewPostModal").should("not.be.visible");
    cy.get("[data-cy=newPost]").within(() => {
      cy.get("[data-cy=richEditor]").type(testStr);
      cy.get("[data-cy-role=submit]").first().click();
    });

    cy.get("[data-cy-type=activity] [data-cy-role=content] p").should(
      "contain",
      testStr
    );
  });

  it("Posts a simple message from iphone", () => {
    cy.viewport("iphone-6", "portrait");
    const testStr = `Whatever, dude ${Math.abs(Math.random() * 1000000)}!`;
    cy.visit("/feed");
    cy.get("[data-cy=newPost]").should("not.be.visible");
    cy.get("[data-cy=openNewPostModal").click();

    cy.get("ion-modal [data-cy=newPost]").within(() => {
      cy.get("[data-cy=richEditor]").type(testStr);
    });
    cy.get("ion-modal [data-cy-role=submit]").first().click();

    cy.get("[data-cy-type=activity] [data-cy-role=content] p").should(
      "contain",
      testStr
    );
  });

  it("Posts a Link from ipad", () => {
    cy.viewport("ipad-2", "landscape");
    const testStr = `Hier cooler Link: https://twitter.com/bbcdoctorwho`;
    cy.visit("/feed");
    cy.get("[data-cy=newPost]").within(() => {
      cy.get("[data-cy=richEditor]").type(testStr);
      cy.get("[data-cy-obj=link] a")
        .should("have.attr", "href")
        .and("contain", "https://twitter.com/bbcdoctorwho");
      cy.get("[data-cy-obj=link]").within(() => {
        cy.get("ion-spinner").should("not.exist");
        cy.get("input[name=title]").clear().type("Twitter: @BBCDoctorWho");
      });
      cy.get("[data-cy-role=submit]").first().click();
    });

    cy.get("[data-cy-type=activity] [data-cy-obj=link] a")
      .should("have.attr", "href")
      .and("contain", "https://twitter.com/bbcdoctorwho");
  });

  it("Posts a Link from iphone", () => {
    cy.viewport("iphone-6", "portrait");
    const testStr = `Hier cooler Link: https://twitter.com/bbcdoctorwho`;
    cy.visit("/feed");

    cy.get("[data-cy=newPost]").should("not.be.visible");
    cy.get("[data-cy=openNewPostModal").click();

    cy.get("ion-modal [data-cy=newPost]").within(() => {
      cy.get("[data-cy=richEditor]").type(testStr);
      cy.get("[data-cy-obj=link] a")
        .should("have.attr", "href")
        .and("contain", "https://twitter.com/bbcdoctorwho");
      cy.get("[data-cy-obj=link]").within(() => {
        cy.get("ion-spinner").should("not.exist");
        cy.get("input[name=title]").clear().type("Twitter: @BBCDoctorWho");
      });
    });
    cy.get("ion-modal [data-cy-role=submit]").first().click();

    cy.get("[data-cy-type=activity] [data-cy-obj=link] a")
      .should("have.attr", "href")
      .and("contain", "https://twitter.com/bbcdoctorwho");
  });

  it("Posts a Link via button from ipad", () => {
    cy.viewport("ipad-2", "landscape");
    const link =
      "https://medium.com/slack-developer-blog/everything-you-ever-wanted-to-know-about-unfurling-but-were-afraid-to-ask-or-how-to-make-your-e64b4bb9254";
    cy.visit("/feed");
    cy.get("[data-cy=newPost] [data-cy=addLink]").click();
    // opens a popup
    cy.get("ion-alert").within(() => {
      cy.wait(500);
      cy.get("input[type=url]").type(link);
      cy.get("button").last().click();
    });

    cy.get("[data-cy=newPost]")
      .scrollIntoView()
      .within(() => {
        cy.get("[data-cy-obj=link] a")
          .should("have.attr", "href")
          .and("contain", link);
        cy.get("[data-cy-obj=link]").within(() => {
          cy.get("ion-spinner").should("not.exist");
          // cy.get('input[name=title]', { includeShadowDom: true })
          //   .contains("Everything you ever wanted to know about unfurling but were afraid to ask /or/ How to make your…");
          // cy.get('ion-img img')
          //   .scrollIntoView()
          //   .should("have", "src");
          // cy.get('textarea').contains('Let’s start with the most obvious question first. This is what an “unfurl” is:')
        });
        cy.get("[data-cy-role=submit]").first().click();
      });

    cy.get("[data-cy-type=activity] [data-cy-obj=link] a")
      .should("have.attr", "href", link)
      .then(($a) => {
        cy.get($a).contains(
          "Everything you ever wanted to know about unfurling but were afraid to ask /or/ How to make your…"
        );
        cy.get($a)
          .parents("[data-cy-obj=link]")
          .contains(
            "Let’s start with the most obvious question first. This is what an “unfurl” is:"
          );
      });
  });


  it("Posts a Link via button from iphone", () => {
    cy.viewport("iphone-6", "portrait");
    const link =
      "https://medium.com/slack-developer-blog/everything-you-ever-wanted-to-know-about-unfurling-but-were-afraid-to-ask-or-how-to-make-your-e64b4bb9254";
    cy.visit("/feed");

    cy.get("[data-cy=newPost]").should("not.be.visible");
    cy.get("[data-cy=openNewPostModal").click();
    cy.get("ion-modal [data-cy=newPost] [data-cy=addLink]").click();
    // opens a popup
    cy.get("ion-alert").within(() => {
      cy.wait(500);
      cy.get("input[type=url]").type(link);
      cy.get("button").last().click();
    });

    cy.get("ion-modal [data-cy=newPost]")
      .within(() => {
        cy.get("[data-cy-obj=link] a")
          .should("have.attr", "href")
          .and("contain", link);
        cy.get("[data-cy-obj=link]").within(() => {
          cy.get("ion-spinner").should("not.exist");
          // cy.get('input[name=title]', { includeShadowDom: true })
          //   .contains("Everything you ever wanted to know about unfurling but were afraid to ask /or/ How to make your…");
          // cy.get('ion-img img')
          //   .scrollIntoView()
          //   .should("have", "src");
          // cy.get('textarea').contains('Let’s start with the most obvious question first. This is what an “unfurl” is:')
        });
      });

    cy.get("ion-modal [data-cy-role=submit]").first().click();

    cy.get("[data-cy-type=activity] [data-cy-obj=link] a")
      .should("have.attr", "href", link)
      .then(($a) => {
        cy.get($a).contains(
          "Everything you ever wanted to know about unfurling but were afraid to ask /or/ How to make your…"
        );
        cy.get($a)
          .parents("[data-cy-obj=link]")
          .contains(
            "Let’s start with the most obvious question first. This is what an “unfurl” is:"
          );
      });
  });
});
