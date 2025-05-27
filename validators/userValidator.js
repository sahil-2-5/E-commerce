const { check, validationResult } = require('express-validator');
const dns = require('dns');
const util = require('util');
const resolveMx = util.promisify(dns.resolveMx);

exports.validateEmail = [
  check('email')
    .isEmail()
    .withMessage('Invalid email format')
    .custom((email) => {
      const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];
      const domain = email.split('@')[1];
      if (!allowedDomains.includes(domain)) {
        throw new Error('Email domain is not supported. Try using Gmail, Yahoo');
      }
      return true;
    })
    .custom(async (email) => {
      const domain = email.split('@')[1];
      const records = await resolveMx(domain).catch(() => null);
      if (!records || records.length === 0) {
        throw new Error('Email domain does not exist or is not receiving emails.');
      }
      return true;
    }),

  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
