import director from './services/director';

export default function stop(context?: any, property?: string) {
  director.removeTimeline(context, property);
}
