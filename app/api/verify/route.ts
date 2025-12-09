export async function GET(request: Request) {
  try {
    const githubId = process.env.GITHUB_ID || '';
    
    return Response.json({ 
      status: "success",
      message: "Verification API is working",
      githubIdExists: !!githubId,
      githubIdLength: githubId.length
    });
  } catch (error) {
    return Response.json({ 
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
