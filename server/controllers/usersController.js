module.exports = {
  getUser: (req, res) => {
    // console.log('getUser - req', req);

    // console.log('getUser - req.session', req.session);

    res.json({ user: req.session.user });
  }
};
