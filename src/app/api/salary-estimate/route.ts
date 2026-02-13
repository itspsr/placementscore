import { NextResponse } from 'next/server';

const SALARY_DATABASE: any = {
  "Software Engineer": { base: 600000, multiplier: 1.2, max: 2500000 },
  "Data Analyst": { base: 500000, multiplier: 1.15, max: 2000000 },
  "MBA / Management": { base: 800000, multiplier: 1.25, max: 4000000 },
  "BTech / Engineering": { base: 450000, multiplier: 1.1, max: 1800000 },
  "Full Stack Developer": { base: 700000, multiplier: 1.2, max: 3000000 },
  "UI/UX Designer": { base: 400000, multiplier: 1.1, max: 1500000 },
};

const CITY_MULTIPLIERS: any = {
  "Bangalore": 1.3,
  "Pune": 1.1,
  "Hyderabad": 1.15,
  "Mumbai": 1.25,
  "Delhi": 1.2,
};

export async function POST(req: Request) {
  try {
    const { role, experience, city } = await req.json();

    const roleData = SALARY_DATABASE[role] || SALARY_DATABASE["Software Engineer"];
    const cityMultiplier = CITY_MULTIPLIERS[city] || 1.0;

    // Estimate Logic: base * (1 + exp * 0.1) * city
    const avg = Math.round(roleData.base * (1 + experience * 0.15) * cityMultiplier);
    const min = Math.round(avg * 0.8);
    const max = Math.min(roleData.max, Math.round(avg * 1.5));
    const top10 = Math.round(max * 0.95);

    return NextResponse.json({
      success: true,
      min,
      avg,
      max,
      top10,
      role,
      city,
      experience
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to estimate salary" }, { status: 500 });
  }
}
