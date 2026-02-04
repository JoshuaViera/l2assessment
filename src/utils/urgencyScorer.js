/**
 * Urgency Scorer - Improved keyword-based urgency calculation
 * Focuses on actual problem indicators rather than message formatting
 */

export function calculateUrgency(message) {
  const lowerMessage = message.toLowerCase()
  let urgencyScore = 50 // Start neutral
  
  // CRITICAL KEYWORDS - Immediate attention needed
  const criticalKeywords = [
    'down', 'outage', 'crash', 'critical', 'emergency', 'urgent',
    'broken', 'not working', 'can\'t access', 'cannot access',
    'lost data', 'data loss', 'security breach', 'hacked',
    'payment failed', 'charged twice', 'overcharged',
    'can\'t log in', 'cannot log in', 'locked out'
  ]
  
  // HIGH PRIORITY KEYWORDS - Important but not critical
  const highPriorityKeywords = [
    'bug', 'error', 'issue', 'problem', 'stuck', 'frozen',
    'slow', 'loading', 'timeout', 'failed', 'billing',
    'refund', 'cancel', 'upgrade', 'downgrade'
  ]
  
  // LOW PRIORITY INDICATORS - Not urgent
  const lowPriorityIndicators = [
    'thank', 'thanks', 'appreciate', 'love', 'great',
    'excellent', 'wonderful', 'amazing', 'feature request',
    'suggestion', 'could you', 'would be nice', 'when you get a chance'
  ]
  
  // QUESTION INDICATORS - Usually medium priority
  const questionWords = ['how', 'what', 'when', 'where', 'why', 'can i', 'is there']
  
  // Check for critical keywords
  for (const keyword of criticalKeywords) {
    if (lowerMessage.includes(keyword)) {
      urgencyScore += 50
      break // Only count once
    }
  }
  
  // Check for high priority keywords
  for (const keyword of highPriorityKeywords) {
    if (lowerMessage.includes(keyword)) {
      urgencyScore += 25
      break // Only count once
    }
  }
  
  // Check for low priority indicators
  for (const indicator of lowPriorityIndicators) {
    if (lowerMessage.includes(indicator)) {
      urgencyScore -= 30
      break // Only count once
    }
  }
  
  // Questions are generally medium priority unless they contain urgent keywords
  let hasQuestion = false
  for (const word of questionWords) {
    if (lowerMessage.includes(word) || lowerMessage.includes('?')) {
      hasQuestion = true
      break
    }
  }
  
  if (hasQuestion && urgencyScore < 70) {
    urgencyScore -= 10
  }
  
  // ALL CAPS might indicate urgency (but only if message is substantial)
  if (message === message.toUpperCase() && message.length > 20 && !message.includes('THANK')) {
    urgencyScore += 15
  }
  
  // Multiple urgent indicators = definitely high priority
  let urgentCount = 0
  for (const keyword of criticalKeywords) {
    if (lowerMessage.includes(keyword)) urgentCount++
  }
  if (urgentCount >= 2) {
    urgencyScore += 20
  }
  
  // Determine final urgency level
  if (urgencyScore >= 80) return "High"
  if (urgencyScore <= 35) return "Low"
  return "Medium"
}