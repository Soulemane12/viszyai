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

    // Generate vCard
    const walletGenerator = WalletPassGenerator.getInstance();
    const vCard = await walletGenerator.generateVCard(contactData);

    // Return the vCard as a downloadable file
    return new NextResponse(vCard, {
      status: 200,
      headers: {
        'Content-Type': 'text/vcard',
        'Content-Disposition': `attachment; filename="${handle}-contact.vcf"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Error generating vCard:', error);
    return NextResponse.json(
      { error: 'Failed to generate vCard' },
      { status: 500 }
    );
  }
}
