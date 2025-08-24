import connectedDB from '@/config/database';
import User from '@/models/User';

export default async function handler(req, res) {
  await connectedDB();

  const { id } = req.query;

  try {
    const user = await User.findById(id).lean(); // lean() returns plain JS object

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Send safe data
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        provider: user.provider,
        hasPassword: !!user.password // boolean flag instead of raw hash
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}



