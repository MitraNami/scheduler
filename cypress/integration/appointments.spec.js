

describe("Appointments", () => {

  beforeEach(() => {
    cy.request("GET", "/api/debug/reset" );
    cy.visit("/");
    cy.contains("Monday");

  });


  it("should book an interview", () => {
   
    cy.get("[alt=Add]").first().click();

    cy.get("[data-testid=student-name-input]").type("Mitra Nami");
    cy.get("[alt='Sylvia Palmer']").click();
    cy.contains("Save").click();

    cy.contains(".appointment__card--show", "Mitra Nami");
    cy.get(".appointment__card--show").last().contains("Sylvia Palmer");
  });




});