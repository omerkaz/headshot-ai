# AI Headshot Generator PRD

## 1. Objective

Create a mobile app that transforms user-provided selfies into professional headshots using fal.ai's Flux-LoRA Portrait Trainer.

## 2. Key Features

### 2.1 Image Acquisition

- Minimum 10 image upload via device camera or gallery
- Image validation system:
  - Face detection (single face per image)
  - Image quality checks (resolution, lighting)
  - Diversity requirements (different angles/expressions)

### 2.2 AI Processing Pipeline

1. **Model Training**

   - Secure API integration with fal.ai's `/train` endpoint
   - Training parameters:
     ```json
     {
       "trainer": "flux-lora-portrait-trainer",
       "max_steps": 2000,
       "resolution": 1024
     }
     ```
2. **Weight File Management**

   - Secure storage of trained weights
   - Version control for different training sessions
   - User-specific weight isolation
3. **Headshot Generation**

   - Integration with fal.ai's `/inference` endpoint
   - Customizable parameters:
     - Background styles
     - Professional attire variants
     - Lighting presets

### 2.3 User Interface

- Progress tracking for training/generation
- Result gallery with sharing capabilities
- Batch management for multiple sessions

## 3. Technical Requirements

### 3.1 Stack

- React Native (Expo SDK 50+)
- State Management: Context API + useReducer
- Navigation: React Navigation 7.x
- Image Processing: react-native-vision-camera + expo-image-manipulator

### 3.2 Security

- HTTPS for all API calls
- API key rotation strategy
- Secure local storage for user credentials
- GDPR-compliant image handling

### 3.3 Performance

- Background processing for AI operations
- Image compression pipeline (target <1MB/image)
- Offline queue for failed API requests

## 4. Milestones

### Phase 1: Core Functionality (4 Weeks)

- [ ] Image upload & validation system
- [ ] fal.ai API integration
- [ ] Basic training/generation UI

### Phase 2: Enhanced UX (3 Weeks)

- [ ] Real-time progress tracking
- [ ] Result gallery with filters
- [ ] Batch management system

### Phase 3: Optimization (2 Weeks)

- [ ] Performance benchmarking
- [ ] Security audit
- [ ] App Store/GPlay deployment

## 5. Success Metrics

- <3% training failure rate
- <2s image processing latency (post-upload)
- > 85% user retention after first generation
  >
