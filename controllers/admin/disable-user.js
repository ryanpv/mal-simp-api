const { getAuth } = require('firebase-admin/auth');

const disableUser = async (req, res) => {
  try {
    console.log('disable route hit', req.body);
    const getUser = await getAuth().getUserByEmail(req.body.userEmail)
    await getAuth().updateUser(getUser.UserRecord.uid, {
      disabled: true,
    })

    res.send({ message: `User account for ${ req.body.userEmail } is locked.` })
  } catch(err) {
    res.status(400).send(err)
  }
}

module.exports = disableUser