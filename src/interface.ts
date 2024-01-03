export type GanttProps = {
  data: {[key: string]: OriginTaskInfo[] },
  startDate: moment.Moment,
  endDate: moment.Moment
} 

export type DataType = {
  name: string;
  task: TaskInfo[];
};

export type DateType = {
  days: string;
  date: number;
  detail: string;
};

export const Colors: { [x: string]: string } = {
  Done: "#87d068",
  Doing: "#faad14",
  "TO DO": "#2db7f5",
};

export type TaskInfo = {
  status: string;
  jira_key: string;
  story_points: number;
  summary: string;
  date: string[];
  parent_key: string;
  parent_summary: string;
  position: string;
  leftOver: boolean;
  rightOver: boolean;
}

export type OriginTaskInfo = {
  status: string;
  jira_key: string;
  story_points: number;
  summary: string;
  date: string[];
  parent_key: string;
  parent_summary: string;
  dev_start_date: number;
  dev_due_date: number;
}

