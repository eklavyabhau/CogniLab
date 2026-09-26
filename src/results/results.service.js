import Experiment from '../experiments/experiment.model.js';
import ParticipantSession from '../participants/participant.model.js';
import Response from '../responses/response.model.js';

export const getExperimentResults = async (researcherId, experimentId) => {
  const experiment = await Experiment.findOne({ _id: experimentId, researcher: researcherId });
  if (!experiment) {
    const error = new Error('Experiment not found');
    error.statusCode = 404;
    throw error;
  }
  const sessions = await ParticipantSession.find({ experiment: experimentId, status: 'COMPLETED' });
  const totalParticipants = sessions.length;
  if (totalParticipants === 0) {
    return {
      experiment,
      analytics: {
        totalParticipants: 0,
        avgReactionTimeMs: 0,
        avgAccuracyPercentage: 0,
        reliabilityDistribution: { high: 0, medium: 0, low: 0 },
      },
      sessions: [],
    };
  }
  const sessionIds = sessions.map((s) => s._id);
  const allResponses = await Response.find({ participantSession: { '': sessionIds } });
  const validRts = allResponses.map((r) => r.reactionTimeMs);
  const avgReactionTimeMs = validRts.length ? Math.round(validRts.reduce((a, b) => a + b, 0) / validRts.length) : 0;
  const correctResponses = allResponses.filter((r) => r.correct === true).length;
  const avgAccuracyPercentage = allResponses.length ? Math.round((correctResponses / allResponses.length) * 100) : 0;
  const reliabilityDistribution = { high: 0, medium: 0, low: 0 };
  sessions.forEach((s) => {
    const score = s.reliabilityScore !== null ? s.reliabilityScore : 70;
    if (score >= 85) reliabilityDistribution.high += 1;
    else if (score >= 65) reliabilityDistribution.medium += 1;
    else reliabilityDistribution.low += 1;
  });
  return {
    experiment,
    analytics: {
      totalParticipants,
      avgReactionTimeMs,
      avgAccuracyPercentage,
      reliabilityDistribution,
    },
    sessions: sessions.map((s) => ({
      id: s._id,
      anonymousCode: s.anonymousCode,
      reliabilityScore: s.reliabilityScore,
      reliabilitySummary: s.reliabilitySummary,
      reliabilityFlags: s.reliabilityFlags,
      isLowReliability: s.reliabilityScore !== null && s.reliabilityScore < 65,
      startedAt: s.startedAt,
      completedAt: s.completedAt,
    })),
  };
};

export const getSessionDetail = async (researcherId, experimentId, sessionId) => {
  const experiment = await Experiment.findOne({ _id: experimentId, researcher: researcherId });
  if (!experiment) {
    const error = new Error('Experiment not found');
    error.statusCode = 404;
    throw error;
  }
  const session = await ParticipantSession.findOne({ _id: sessionId, experiment: experimentId });
  if (!session) {
    const error = new Error('Participant session not found');
    error.statusCode = 404;
    throw error;
  }
  const responses = await Response.find({ participantSession: sessionId }).populate('trial');
  return {
    session,
    responses,
  };
};
