# Headshot Profile Backend

A Node.js backend service for preparing headshot profiles for Lora training. The service handles the creation and storage of zip files containing profile images, which can be challenging to perform within React Native.

## Setup

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies

```bash
npm install
```

4. Create a `.env` file based on `.env.example` and add your actual configuration values

```bash
cp .env.example .env
```

Then edit the `.env` file with your actual values.

### Running the server

#### Development mode

```bash
npm run dev
```

#### Production mode

```bash
npm run build
npm start
```

## API Documentation

### Prepare Profile for Lora

Prepares a profile by creating a zip file of the profile's images and uploading it to storage.

- **URL**: `/api/profiles/:profileId/prepare`
- **Method**: `POST`
- **URL Params**:
  - `profileId`: ID of the profile to prepare
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "profileId": "profile-uuid",
        "triggerPhrase": "John person",
        "zipUrl": "https://storage.example.com/file.zip"
      }
    }
    ```
- **Error Response**:
  - **Code**: 400 or 500
  - **Content**:
    ```json
    {
      "success": false,
      "error": "Error message"
    }
    ```

## Integration with Frontend

Update your frontend to call this API endpoint instead of performing the zip creation locally:

```typescript
const prepareProfile = async (profileId: string) => {
  try {
    const response = await fetch(`${API_URL}/api/profiles/${profileId}/prepare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to prepare profile: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error preparing profile:', error);
    throw error;
  }
};
```

Then use this function in place of the direct `prepareProfileToLora` call in your React Native app.
