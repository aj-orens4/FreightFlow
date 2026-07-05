/*
  Purpose: Blocks access to protected API routes unless the request has a valid session
  Author: FreightFlow Engineering
  Version: 0.1.0
  Last Updated: 2026-07-05
*/

function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: "Not authenticated." });
}

module.exports = requireAuth;
