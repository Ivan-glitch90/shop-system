const { expect } = require("chai");
const sinon = require("sinon");
const requireRole = require("../middleware/requireRole");

describe("requireRole middleware", () => {

    it("calls next() when the user has the required role", () => {
        const req = {
            isAuthenticated: () => true,
            user: { role: "owner" }
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        const next = sinon.stub();

        requireRole("owner")(req, res, next);

        expect(next.called).to.be.true; // owner matches owner, so the request continues
        expect(res.status.called).to.be.false; // success path never touches res
    });

    it("responds with 403 when the user is logged in but has the wrong role", () => {
        const req = {
            isAuthenticated: () => true,
            user: { role: "employee" }
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        const next = sinon.stub();

        requireRole("owner")(req, res, next);

        expect(next.called).to.be.false;
        expect(res.status.calledWith(403)).to.be.true;
        expect(res.json.calledWith({ error: "You don't have permission to do that." })).to.be.true; 
    });

    it("responds with 401 when the user is not logged in", () => {
        const req = {
            isAuthenticated: () => false
            // no user property at all. Think about why that's safe here
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        const next = sinon.stub();

        requireRole("owner")(req, res, next);

        expect(next.called).to.be.false;
        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith({ error: "You must be logged in to do that." })).to.be.true;
    });

});