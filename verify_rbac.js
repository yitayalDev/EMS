const mongoose = require('mongoose');
const User = require('./server/models/user');
const { authorize, checkPermission } = require('./server/middleware/authMiddleware');

async function test() {
    console.log("--- Starting RBAC Verification ---");

    // 1. Test Model Roles
    const roles = ['admin', 'employee', 'hr', 'finance', 'it_admin'];
    console.log("Checking role enums...");
    const roleEnum = User.schema.path('role').options.enum;
    const missingRoles = roles.filter(r => !roleEnum.includes(r));
    if (missingRoles.length === 0) {
        console.log("✅ All roles correctly added to User model.");
    } else {
        console.error("❌ Missing roles:", missingRoles);
    }

    // 2. Test Middleware Logic
    const mockUser = (role, permissions = []) => ({ role, permissions });

    const testAuthorize = (role, allowedRoles) => {
        let nextCalled = false;
        const req = { user: mockUser(role) };
        const res = { status: (code) => ({ json: (msg) => { console.log(`   [${role}] access to ${allowedRoles}: ${code === 403 ? 'DENIED' : 'ALLOWED'}`); } }) };
        const next = () => { nextCalled = true; };

        authorize(...allowedRoles)(req, res, next);
        return nextCalled;
    };

    console.log("\nTesting Authorize Middleware:");
    console.log("Admin access to ['hr']:", testAuthorize('admin', ['hr']) ? "✅" : "❌");
    console.log("Finance access to ['finance']:", testAuthorize('finance', ['finance']) ? "✅" : "❌");
    console.log("Employee access to ['admin']:", testAuthorize('employee', ['admin']) ? "❌ (Expected Denied)" : "✅ (Denied)");

    const testPermission = (role, permissions, required) => {
        let nextCalled = false;
        const req = { user: mockUser(role, permissions) };
        const res = { status: (code) => ({ json: (msg) => { console.log(`   [${role} w/ ${permissions}] needed ${required}: ${code === 403 ? 'DENIED' : 'ALLOWED'}`); } }) };
        const next = () => { nextCalled = true; };

        checkPermission(required)(req, res, next);
        return nextCalled;
    };

    console.log("\nTesting Permission Middleware:");
    console.log("Admin needed 'delete_employee':", testPermission('admin', [], 'delete_employee') ? "✅" : "❌");
    console.log("HR w/ 'delete_employee' needed 'delete_employee':", testPermission('hr', ['delete_employee'], 'delete_employee') ? "✅" : "❌");
    console.log("HR w/o permission needed 'delete_employee':", testPermission('hr', [], 'delete_employee') ? "❌ (Expected Denied)" : "✅ (Denied)");

    console.log("\n--- Verification Complete ---");
}

test().catch(console.error);
