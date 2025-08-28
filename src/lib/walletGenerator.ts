import { PKPass } from 'passkit-generator';
import path from 'path';
import fs from 'fs';

export interface ContactData {
  handle: string;
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  bio?: string;
  profileImage?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
}

export class WalletPassGenerator {
  private static instance: WalletPassGenerator;
  private certificatesPath: string;

  constructor() {
    this.certificatesPath = path.join(process.cwd(), 'certificates');
  }

  public static getInstance(): WalletPassGenerator {
    if (!WalletPassGenerator.instance) {
      WalletPassGenerator.instance = new WalletPassGenerator();
    }
    return WalletPassGenerator.instance;
  }

  public async generateAppleWalletPass(data: ContactData): Promise<Buffer> {
    const passData = this.createPassData(data);
    
    try {
      // Check if certificates exist
      const certificates = this.loadCertificates();
      
      if (certificates) {
        // Generate signed pass with certificates
        const pass = new PKPass(
          {}, // Template folder (can be customized)
          certificates,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          passData as any
        );
        
        return await pass.getAsBuffer();
      } else {
        // Generate unsigned pass for development
        return this.generateUnsignedPass(data);
      }
    } catch (error) {
      console.error('Error generating wallet pass:', error);
      throw new Error('Failed to generate wallet pass');
    }
  }

  private createPassData(data: ContactData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const passData: any = {
      formatVersion: 1 as const,
      passTypeIdentifier: process.env.APPLE_PASS_TYPE_IDENTIFIER || "pass.com.viszy.contact",
      serialNumber: `${data.handle}-${Date.now()}`,
      teamIdentifier: process.env.APPLE_TEAM_IDENTIFIER || "YOUR_TEAM_ID",
      organizationName: "Viszy",
      description: `${data.name} - Digital Contact Card`,
      
      // Visual styling
      backgroundColor: "rgb(79, 70, 229)", // Indigo
      foregroundColor: "rgb(255, 255, 255)",
      labelColor: "rgb(255, 255, 255)",
      
      // Pass structure
      generic: {
        primaryFields: [
          {
            key: "name",
            label: "Contact",
            value: data.name,
            textAlignment: "PKTextAlignmentLeft"
          }
        ],
        secondaryFields: [],
        auxiliaryFields: [],
        backFields: [
          {
            key: "profile_url",
            label: "View Full Profile",
            value: `https://viszyai.vercel.app/profile/${data.handle}`,
            attributedValue: `<a href="https://viszyai.vercel.app/profile/${data.handle}">View Profile</a>`
          }
        ]
      },

      // QR Code linking to profile
      barcodes: [
        {
          message: `https://viszyai.vercel.app/profile/${data.handle}`,
          format: "PKBarcodeFormatQR",
          messageEncoding: "iso-8859-1",
          altText: "Scan to view profile"
        }
      ],

      // When the pass is relevant
      relevantDate: new Date().toISOString(),
      
      // Optional: Web service for pass updates
      webServiceURL: process.env.NEXT_PUBLIC_APP_URL || "https://viszyai.vercel.app",
      authenticationToken: `wallet-${data.handle}-${Date.now()}`
    };

    // Add title if available
    if (data.title) {
      passData.generic.secondaryFields.push({
        key: "title",
        label: "Title", 
        value: data.title,
        textAlignment: "PKTextAlignmentLeft"
      });
    }

    // Add contact details to back
    if (data.email) {
      passData.generic.backFields.push({
        key: "email",
        label: "Email",
        value: data.email,
        attributedValue: `<a href="mailto:${data.email}">${data.email}</a>`
      });
    }

    if (data.phone) {
      passData.generic.backFields.push({
        key: "phone",
        label: "Phone", 
        value: data.phone,
        attributedValue: `<a href="tel:${data.phone}">${data.phone}</a>`
      });
    }

    if (data.bio) {
      passData.generic.backFields.push({
        key: "bio",
        label: "About",
        value: data.bio
      });
    }

    // Add social links
    data.socialLinks?.forEach((link, index) => {
      if (link.url && link.platform) {
        passData.generic.backFields.push({
          key: `social_${index}`,
          label: link.platform,
          value: link.url,
          attributedValue: `<a href="${link.url}">${link.platform}</a>`
        });
      }
    });

    return passData;
  }

  private loadCertificates() {
    try {
      const wwdrPath = path.join(this.certificatesPath, 'wwdr.pem');
      const certPath = path.join(this.certificatesPath, 'signerCert.pem');
      const keyPath = path.join(this.certificatesPath, 'signerKey.pem');

      if (fs.existsSync(wwdrPath) && fs.existsSync(certPath) && fs.existsSync(keyPath)) {
        return {
          wwdr: fs.readFileSync(wwdrPath),
          signerCert: fs.readFileSync(certPath),
          signerKey: fs.readFileSync(keyPath),
          signerKeyPassphrase: process.env.APPLE_CERT_PASSPHRASE || ''
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error loading certificates:', error);
      return null;
    }
  }

  private async generateUnsignedPass(data: ContactData): Promise<Buffer> {
    // Create a fallback pass structure for development
    const passInfo = {
      type: 'apple-wallet-pass',
      status: 'development-mode',
      message: 'This is a development version. For production, Apple Developer certificates are required.',
      contact: {
        name: data.name,
        title: data.title,
        handle: data.handle,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        socialLinks: data.socialLinks,
        profileUrl: `https://viszyai.vercel.app/profile/${data.handle}`,
        qrCodeUrl: `https://viszyai.vercel.app/qr/${data.handle}`
      },
      instructions: {
        forProduction: [
          "1. Obtain Apple Developer account ($99/year)",
          "2. Create Pass Type ID in Apple Developer Console",
          "3. Generate Pass Type ID Certificate",
          "4. Download WWDR Certificate",
          "5. Add certificates to /certificates folder",
          "6. Set environment variables for APPLE_PASS_TYPE_IDENTIFIER and APPLE_TEAM_IDENTIFIER"
        ]
      },
      timestamp: new Date().toISOString()
    };

    return Buffer.from(JSON.stringify(passInfo, null, 2));
  }

  public async generateVCard(data: ContactData): Promise<string> {
    // Enhanced vCard generation as fallback
    const vCard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${data.name}`,
      data.title ? `TITLE:${data.title}` : '',
      data.email ? `EMAIL:${data.email}` : '',
      data.phone ? `TEL:${data.phone}` : '',
      data.bio ? `NOTE:${data.bio}` : '',
      `URL:https://viszyai.vercel.app/profile/${data.handle}`,
      ...((data.socialLinks || []).map(link => 
        `URL;TYPE=${link.platform}:${link.url}`
      )),
      'END:VCARD'
    ].filter(line => line).join('\r\n');

    return vCard;
  }
}
