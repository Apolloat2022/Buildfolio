export async function GET(request: Request) {
  const githubId = process.env.GITHUB_ID || '';
  
  return Response.json({ 
    status: "Verification",
    githubIdExists: !!githubId,
    githubIdLength: githubId.length,
    githubIdFirst5: githubId.substring(0, 5),
    githubIdLast5: githubId.substring(Math.max(0, githubId.length - 5))
  });
}
