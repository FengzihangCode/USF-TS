import { z } from 'zod'

// Regular expression for time format
export const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/

/**
 * Mapping of subject names to their details
 */
export const SubjectSchema = z.object({
  simplified_name: z.string().optional(),
  teacher: z.string().optional(),
  room: z.string().optional(),
})

export const PeriodSchema = z.tuple([
  z.string().regex(timeRegex),
  z.string().regex(timeRegex),
])

export const TimetableSchema = z.tuple([
  /**
   * Day of the week (1=Monday, 7=Sunday)
   */
  z.number().int().min(1).max(7).describe('Day of the week (1=Monday, 7=Sunday).'),
  /**
   * Week type (all weeks, even weeks, or odd weeks)
   */
  z.enum(['all', 'even', 'odd']).describe('Week type.'),
  /**
   * Subject name (must match keys in 'subjects')
   */
  z.string().describe('Subject name (must match keys in \'subjects\').'),
  /**
   * Class period (1-based index, must match 'periods')
   */
  z.number().int().min(1).describe('Class period (1-based index, must match \'periods\').'),
])

/**
 * A compact and efficient format for storing school schedules
 */
export const Schema = z.object({
  /**
   * USF version, currently fixed at 1
   */
  version: z.number()
    .int()
    .refine(v => v === 1, { message: 'USF version, currently fixed at 1.' })
    .describe('USF version'),

  /**
   * Mapping of subject names to their details
   */
  subjects: z.record(SubjectSchema).describe('Mapping of subject names to their details.'),

  /**
   * List of time periods, each containing a start and end time
   */
  periods: z.array(PeriodSchema).describe('List of time periods, each containing a start and end time.'),

  /**
   * Schedule entries, each defining a class occurrence
   */
  timetable: z.array(TimetableSchema).describe('Schedule entries, each defining a class occurrence.'),
}).strict().describe('A compact and efficient format for storing school schedules.')

// Export type definition
export type USFSchema = z.infer<typeof Schema>
