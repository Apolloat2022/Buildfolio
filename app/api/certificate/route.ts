import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const projectSlug = searchParams.get('project')

    if (!projectSlug) {
      return new NextResponse('Project slug required', { status: 400 })
    }

    const startedProject = await prisma.startedProject.findFirst({
      where: {
        userId: session.user.id,
        projectTemplate: { slug: projectSlug }
      },
      include: {
        user: true,
        projectTemplate: true
      }
    })

    if (!startedProject || !startedProject.certificateEligible) {
      return new NextResponse('Certificate not available', { status: 403 })
    }

    const certNumber = `BF-${Date.now().toString(36).toUpperCase()}`
    const issueDate = startedProject.certificateIssuedAt || new Date()
    const formattedDate = issueDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@300;400&family=Great+Vibes&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body { 
            font-family: 'Lato', sans-serif;
            background: #f5f5f5;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          
          .certificate {
            background: white;
            width: 1100px;
            height: 850px;
            position: relative;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
          }
          
          /* Decorative stripes - moved to not block text */
          .stripe-top {
            position: absolute;
            top: 0;
            right: 0;
            width: 400px;
            height: 200px;
            background: linear-gradient(135deg, #1e3c72 0%, #1e3c72 60%, #d4af37 60%, #d4af37 70%, transparent 70%);
            z-index: 1;
          }
          
          .stripe-bottom {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 400px;
            height: 200px;
            background: linear-gradient(135deg, #d4af37 0%, #d4af37 30%, #1e3c72 30%, #1e3c72 90%, transparent 90%);
            z-index: 1;
          }
          
          .content {
            position: relative;
            z-index: 2;
            padding: 60px 80px;
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #1e3c72;
          }
          
          .apollo-logo {
            width: 200px;
            height: auto;
          }
          
          .buildfolio-text {
            text-align: right;
          }
          
          .logo {
            font-size: 28px;
            font-weight: 700;
            color: #1e3c72;
            font-family: 'Playfair Display', serif;
            letter-spacing: 2px;
          }
          
          .logo-sub {
            font-size: 11px;
            color: #667eea;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-top: 3px;
          }
          
          .title-section {
            text-align: center;
            margin: 20px 0 30px 0;
          }
          
          .main-title {
            font-family: 'Playfair Display', serif;
            font-size: 58px;
            color: #1e3c72;
            letter-spacing: 4px;
            margin-bottom: 8px;
          }
          
          .subtitle {
            font-size: 16px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          
          .presented-to {
            text-align: center;
            font-size: 15px;
            color: #666;
            margin-bottom: 15px;
          }
          
          .recipient-name {
            font-family: 'Great Vibes', cursive;
            font-size: 64px;
            color: #1e3c72;
            text-align: center;
            margin: 25px 0;
            line-height: 1;
          }
          
          .completion-text {
            text-align: center;
            font-size: 15px;
            color: #333;
            line-height: 1.8;
            max-width: 800px;
            margin: 0 auto 20px;
            background: white;
            padding: 20px;
          }
          
          .project-name {
            font-weight: 700;
            color: #c41e3a;
          }
          
          .technologies {
            text-align: center;
            margin: 20px 0;
          }
          
          .tech-badge {
            display: inline-block;
            background: linear-gradient(135deg, #1e3c72, #667eea);
            color: white;
            padding: 6px 14px;
            border-radius: 20px;
            margin: 4px;
            font-size: 11px;
            letter-spacing: 1px;
          }
          
          .footer {
            display: flex;
            justify-content: space-around;
            align-items: flex-end;
            margin-top: auto;
            padding-top: 20px;
          }
          
          .signature-section {
            text-align: center;
            flex: 1;
          }
          
          .signature-line {
            width: 250px;
            border-top: 2px solid #333;
            margin: 0 auto 8px;
            padding-top: 8px;
          }
          
          .signature-name {
            font-family: 'Great Vibes', cursive;
            font-size: 32px;
            color: #1e3c72;
          }
          
          .signature-title {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 3px;
          }
          
          .date-section {
            text-align: center;
            flex: 1;
          }
          
          .date-line {
            width: 200px;
            border-top: 2px solid #333;
            margin: 0 auto 8px;
            padding-top: 8px;
          }
          
          .date {
            font-size: 15px;
            color: #333;
            font-weight: 600;
          }
          
          .date-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 3px;
          }
          
          .cert-number {
            position: absolute;
            bottom: 15px;
            right: 25px;
            font-size: 9px;
            color: #999;
            z-index: 3;
          }
          
          @media print {
            body { background: white; padding: 0; }
            @page { size: landscape; margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="stripe-top"></div>
          <div class="stripe-bottom"></div>
          
          <div class="content">
            <div class="header">
              <img src="/images/logo.png" alt="Apollo Technologies" class="apollo-logo" />
              <div class="buildfolio-text">
                <div class="logo">BUILDFOLIO</div>
                <div class="logo-sub">Professional Development</div>
              </div>
            </div>
            
            <div class="title-section">
              <div class="main-title">CERTIFICATE</div>
              <div class="subtitle">OF ${startedProject.projectTemplate.title.toUpperCase()}</div>
            </div>
            
            <div class="presented-to">This Certificate Is Proudly Presented To</div>
            
            <div class="recipient-name">${startedProject.user.name || startedProject.user.email}</div>
            
            <div class="completion-text">
              We give this certificate because <span class="project-name">${startedProject.user.name || startedProject.user.email}</span> has completed the 
              <span class="project-name">"${startedProject.projectTemplate.title}"</span> project and passed all assessments,
              demonstrating proficiency in full-stack development and software engineering best practices.
            </div>
            
            <div class="technologies">
              ${startedProject.projectTemplate.technologies.map(tech => 
                `<span class="tech-badge">${tech}</span>`
              ).join('')}
            </div>
            
            <div class="footer">
              <div class="signature-section">
                <div class="signature-line">
                  <div class="signature-name">Robin Pandey</div>
                </div>
                <div class="signature-title">Chief Executive Officer</div>
              </div>
              
              <div class="date-section">
                <div class="date-line">
                  <div class="date">${formattedDate}</div>
                </div>
                <div class="date-label">Date</div>
              </div>
            </div>
          </div>
          
          <div class="cert-number">Certificate No: ${certNumber} | Verify at buildfolio.tech/verify</div>
        </div>
      </body>
      </html>
    `

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })

  } catch (error) {
    console.error('Certificate error:', error)
    return new NextResponse('Error generating certificate', { status: 500 })
  }
}

