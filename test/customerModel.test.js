const { expect } = require("chai");
const Customer = require("../models/customerModel");

describe("Customer model", () => {
  it("rejects a customer with no name", async () => {
    const customer = new Customer({ phone: "8888-1234" });
    let error;
    try {
      await customer.validate();
    } catch (err) {
      error = err;
    }
    expect(error).to.exist;
    expect(error.errors.name).to.exist;
  });

  it("accepts a customer with only a name", async () => {
    const customer = new Customer({ name: "Carlos Mendoza" });
    await customer.validate();
  });
});