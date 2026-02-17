const User = require('../models/User');

const requireAdmin = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'No autenticado' });

    const user = await User.findById(userId).select('role');
    if (!user) return res.status(401).json({ message: 'Usuario no existe' });

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso solo para admin' });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: 'Error validando rol' });
  }
};

module.exports = requireAdmin;
