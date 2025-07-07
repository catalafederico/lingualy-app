"use client"

export default function DebugPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  const testConnection = async () => {
    try {
      console.log("Testing connection to:", apiUrl);
      const response = await fetch(`${apiUrl}/auth/send-verification-email?email=test@example.com`);
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
      alert(`Connection successful! Status: ${response.status}`);
    } catch (error) {
      console.error("Connection failed:", error);
      alert(`Connection failed: ${error.message}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      
      <div className="space-y-4">
        <div>
          <strong>API URL from env:</strong> {apiUrl || "NOT SET"}
        </div>
        
        <div>
          <strong>All env vars:</strong>
          <pre className="bg-gray-100 p-2 rounded mt-2">
            {JSON.stringify(
              Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')).reduce((obj, key) => {
                obj[key] = process.env[key];
                return obj;
              }, {}),
              null,
              2
            )}
          </pre>
        </div>
        
        <button 
          onClick={testConnection}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test API Connection
        </button>
      </div>
    </div>
  );
}