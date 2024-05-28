class RegisterForm {
  elements = {
    // coletando os valores do input
    titleInput: () => cy.get("#title"),
    titleFeedback: () => cy.get("#titleFeedback"),
    imageUrlInput: () => cy.get("#imageUrl"),
    urlFeedback: () => cy.get("#urlFeedback"),
    submitBtn: () => cy.get("#btnSubmit"),
    cardList: () => cy.get("#card-list article"),
  };

  //manipulando valores
  checkItemInList(item) {
    this.elements.cardList().should(($el) => {
      expect($el).to.have.length(4);
    });
  }

  typeTitle(text) {
    if (!text) return;
    this.elements.titleInput().type(text);
  }

  sendTitleWithEnter(text) {
    if (!text) return;
    this.elements.titleInput().type(`${text}{enter}`);
  }

  typeUrl(text) {
    if (!text) return;
    this.elements.imageUrlInput().type(text);
  }

  clickSubmit() {
    this.elements.submitBtn().click();
  }

  hitEnter() {
    cy.focused().type('{enter}')
  }
}

const registerForm = new RegisterForm();
const colors = {
  error: "rgb(220, 53, 69)",
  success: "rgb(25, 135, 84)",
};

describe("Image Registration", () => {
  describe("Submitting an image with invalid inputs", () => {
    after(() => {
      cy.clearAllLocalStorage();
    });

    const input = {
      title: "",
      url: "",
    };

    it("Given I am on the image registration page", () => {
      cy.visit("/");
    });
    it(`When I enter "${input.title}" in the title field`, () => {
      registerForm.typeTitle(input.title);
    });
    it(`Then I enter "${input.url}" in the URL field`, () => {
      registerForm.typeUrl(input.url);
    });
    it(`Then I click the submit button`, () => {
      registerForm.clickSubmit();
    });
    it(`Then I should see "Please type a title for the image" message above the title field`, () => {
      // possibilidade de debugar o código junto ao inspecionar
      // registerForm.elements.titleFeedback().should(element => {
      //   debugger
      // });
      registerForm.elements
        .titleFeedback()
        .should("contains.text", "Please type a title for the image");
    });
    it(`And I should see "Please type a valid URL" message above the imageUrl field`, () => {
      registerForm.elements
        .urlFeedback()
        .should("contains.text", "Please type a valid URL");
    });
    it(`Then I should see ann exclamation icon in the title and URL fields`, () => {
      registerForm.elements.titleInput().should(([element]) => {
        const styles = window.getComputedStyle(element);
        const border = styles.getPropertyValue("border-right-color");
        assert.strictEqual(border, colors.error);
      });
    });
  });

  describe("Submitting an image with valid inputs using enter key", () => {
    // after(() => {
    //   cy.clearAllLocalStorage();
    // });
    
    const input = {
      title: "Alien BR",
      url: "https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg",
    };

    it("Given I am on the image registration page", () => {
      cy.visit("/");
    });

    it(`When I enter "Alien BR" in the title field`, () => {
      registerForm.sendTitleWithEnter(input.title);
    });

    it("Then I should see a check icon in the title field", () => {
      registerForm.elements.titleInput().should(([element]) => {
        const styles = window.getComputedStyle(element);
        const borderColor = styles.getPropertyValue("border-color");
        assert.strictEqual(borderColor, colors.success);
      });
    });

    it(`When I enter "https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg" in the URL field`, () => {
      registerForm.typeUrl(input.url);
    });

    it("Then I should see a check icon in the imageUrl field", () => {
      registerForm.elements.imageUrlInput().should(([element]) => {
        const styles = window.getComputedStyle(element);
        const borderColor = styles.getPropertyValue("border-color");
        assert.strictEqual(borderColor, colors.success);
      });
    });

    it("Then I can hit enter to submit the form", () => {
      registerForm.hitEnter()
      cy.wait(300)
    });

    it("And the list of registered images should be updated with the new item", () => {
      cy.get('#card-list .card-img').should((elements) => {
        const lastElement = elements[elements.length - 1];
        const src = lastElement.getAttribute('src')
        debugger
      })
    });
  });
});
