import { NextRequest, NextResponse } from 'next/server';
import { runAutonomousSocPipeline } from '@/lib/minisoc/agents';
import { ATTACK_SCENARIOS } from '@/lib/minisoc/scenarios';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const scenarioId = searchParams.get('scenario') || 'credential_stuffing';

  try {
    const result = await runAutonomousSocPipeline({ scenarioId });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to analyze scenario' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenarioId, customLogs, logLines } = body;

    const result = await runAutonomousSocPipeline({
      scenarioId,
      customLogs,
      providedLogs: logLines
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to process security analysis' },
      { status: 500 }
    );
  }
}
