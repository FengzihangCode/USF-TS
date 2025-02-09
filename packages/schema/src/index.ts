import { z } from 'zod'

// Regular expression for time format
const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/

/**
 * A compact and efficient format for storing school schedules
 */
export const Schema = z.object({
  /**
   * USF version, currently fixed at 1
   */
  version: z.number().int().describe('USF version, currently fixed at 1.'),

  /**
   * Mapping of subject names to their details
   */
  subjects: z.record(z.object({
    simplified_name: z.string(),
    teacher: z.string(),
    room: z.string(),
  }).strict().required()).describe('Mapping of subject names to their details.'),

  /**
   * List of time periods, each containing a start and end time
   */
  periods: z.array(
    z.tuple([
      z.string().regex(timeRegex),
      z.string().regex(timeRegex),
    ]),
  ).describe('List of time periods, each containing a start and end time.'),

  /**
   * Schedule entries, each defining a class occurrence
   */
  timetable: z.array(
    z.tuple([
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
    ]),
  ).describe('Schedule entries, each defining a class occurrence.'),
}).strict().describe('A compact and efficient format for storing school schedules.')

// Export type definition
export type USFSchema = z.infer<typeof Schema>
