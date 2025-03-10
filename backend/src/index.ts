import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import profileRoutes from './routes/profileRoutes';
import { supabaseAdmin } from './services/supabase';
// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/profiles', profileRoutes);

// Health check route
app.get('/health', async (req, res) => {
  // Get auth status
  const {
    data: { session },
  } = await supabaseAdmin.auth.getSession();
  
  // Try to get profiles
  const { data, error } = await supabaseAdmin.from('headshot_profiles').select('*');
  
  if (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error.message
    });
  } else {
    res.status(200).json({ 
      status: 'ok', 
      message: 'Server is healthy', 
      data,
      authStatus: {
        isAuthenticated: !!session,
        role: session?.user?.role || 'none'
      }
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 