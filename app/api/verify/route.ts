export async function GET() { 
  // DEFINE THE VARIABLES HERE
  const githubId = process.env.GITHUB_ID || '';
  const githubSecret = process.env.GITHUB_SECRET || '';
  
  return Response.json({ 
    status: "Verification", 
    githubIdExists: !!githubId, 
    githubIdLength: githubId.length, 
    githubIdFirst5: githubId.substring(0, 5), 
    githubIdLast5: githubId.substring(Math.max(0, githubId.length - 5)), 
    githubSecretExists: !!githubSecret, 
    githubSecretLength: githubSecret.length, 
    githubSecretStartsWith: githubSecret.substring(0, 4), 
    timestamp: new Date().toISOString(), 
  }); 
}