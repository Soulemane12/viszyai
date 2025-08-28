import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { WalletPassGenerator, ContactData } from '@/lib/walletGenerator';
import { Profile } from '@/lib/database.types';

export async function POST(request: NextRequest) {
  try {
    const { handle } = await request.json();

    if (!handle) {
      return NextResponse.json({ error: 'Handle is required' }, { status: 400 });
    }

    // Fetch profile data from Supabase
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('handle', handle)
      .single() as { data: Profile | null; error: { message: string } | null };

    if (error || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const contactData: ContactData = {
      handle: profile.handle,
      name: profile.name || 'Digital Contact',
      title: profile.title || '',
      email: profile.email,
      phone: profile.phone,
      bio: profile.bio,
      profileImage: profile.photo_url,
      socialLinks: [] // Social links come from a separate table
    };

    // Generate the Apple Wallet pass
    const walletGenerator = WalletPassGenerator.getInstance();
    const pass = await walletGenerator.generateAppleWalletPass(contactData);

    // Return the pass as a downloadable file
    return new NextResponse(new Uint8Array(pass), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="${handle}-contact.pkpass"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Error generating Apple Wallet pass:', error);
    return NextResponse.json(
      { error: 'Failed to generate wallet pass' },
      { status: 500 }
    );
  }
}


