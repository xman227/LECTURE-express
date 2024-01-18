const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User, OAuth } = require('../../models');

const config = {
  clientID: '198011725851-otnrvvh8ua7b0omh18alb5doolmlg3c0.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: "/auth/google/callback"
};

async function findOrCreateUser({ name, email }) {
  const user = await User.findOne({
    email,
  });

  if (user) { 
    return user;
  }

  const created = await User.create({
    name,
    email,
    password: 'GOOGLE_OAUTH',
  });

  return created;
}

module.exports = new GoogleStrategy(config, async (accessToken, refreshToken, profile, done) => {
  const { email, name } = profile._json;

  try {
    const user = await findOrCreateUser({ email, name })
    done(null, {
      shortId: user.shortId,
      email: user.email,
      name: user.name,
    });
  } catch (e) {
    done(e, null);
  }
});