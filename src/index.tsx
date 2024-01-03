import moment, { Moment } from "moment";
import { Popover } from "antd";
import { useEffect, useState } from "react";
import './gantt.less';
import { DateType, DataType, Colors, TaskInfo, GanttProps } from "./interface";

const reg = /(\[FE\])|(\[BE\])|(\[QA\])|(\[iOS\])|(\[Andriod\])|(\[TH\])|(\[VN\])|(\[ID\])/g;
const Week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const offsetDays = (date: number, base: Moment) => {
  const curDate = moment.unix(date).endOf("days");
  // 以一年的第一天为基准计算偏移
  return curDate.diff(base, "days") + 1;
};

function computeGridColumn(date: number[], base: Moment, end: Moment) {
  // 处理data[0]开始时间在开始时间， data[1]在结束时间之后的情况
  const diff = end.diff(base, "days") + 1;
  let leftOver = false;
  let rightOver = false;
  let _start = offsetDays(date[0], base);
  let _end = offsetDays(date[1], base) + 1;
  if (moment.unix(date[0]).endOf("days").isBefore(base)) {
    leftOver = true;
    _start = 1;
  }

  if (moment.unix(date[1]).isAfter(end)) {
    rightOver = true;
    _end = diff + 1;
  }
  return {
    position: `${_start}/${_end}`,
    leftOver,
    rightOver,
  };
}

export default (props: GanttProps) => {
  const [showData, setShowData] = useState<DataType[]>([]);
  const [showDate, setShowDate] = useState<DateType[]>([]);

  const getShowData = (start: Moment, end: Moment) => {
    const tempData = Object.keys(props.data).map((name: string) => {
      const showTask = props.data[name].map((item: any) => {
        return {
          ...item,
          date: [
            moment.unix(item.dev_start_date).format("YYYY-MM-DD"),
            moment.unix(item.dev_due_date).format("YYYY-MM-DD"),
          ],
          ...computeGridColumn(
            [item.dev_start_date, item.dev_due_date],
            start,
            end
          ),
        };
      });
      return { name, task: showTask };
    });
    setShowData(tempData);
  };

  const getShowDate = (start: Moment, end: Moment) => {
    if (!start || !end) return [];
    // 静态的日期数据
    const dateTemp = [];
    for (let i = start; !end.isBefore(i); i = moment(i).add(1, "days")) {
      const obj = {
        detail: i.format("YYYY-MM-DD"),
        days: Week[i.days()],
        date: i.date(),
      };
      dateTemp.push(obj);
    }
    setShowDate(dateTemp);
  };


  const renderDataHeader = (date: DateType[]) => {
    return (
      <div
      className="grid grid-cols-120 gantt__row gantt__row--months"
      style={{
        gridTemplateColumns: `120px repeat(${date.length}, 1fr)`,
      }}
    >
      <div className="gantt__row-first-1" />
      {date.map((item, index) => {
        const content = (
          <span
            key={item.detail}
            style={{
              backgroundColor: `${
                /(Sat)|(Sun)/.test(item.days) ? "#fff1f0" : "unset"
              }`,
            }}
          >
            {item.date}
            <br />
            {item.days}
          </span>
        );
        return (
          <Popover /* content={detailInfo} */ key={index} visible={false}>
            {content}
          </Popover>
        );
      })}
    </div>
    )
  }

  // 线条数量与日期天数一致
  const renderDataTable = (date: DateType[]) => {
    return (
      <div
      className="gantt__row gantt__row--lines"
      style={{
        gridTemplateColumns: `120px repeat(${date.length}, 1fr)`,
      }}
    >
      {showDate.map((_, index) => (
        <span
          key={index} /*onMouseEnter={() => setTriggerIndex(index - 1)} */
        />
      ))}
    </div>
    )
  }

  // 数据项 * N个，分为 头 + 数据项
  const renderDataBody = (data: DataType[]) => {
    return data.map((item, idx) => {
      return (
        <div className="gantt__row" key={idx}>
          <div className="gantt__row-first">{item.name}</div>
          <ul
            className="gantt__row-bars"
            style={{
              gridTemplateColumns: `repeat(${showDate.length}, 1fr)`,
            }}
          >
            {renderTaskPopup(item.task)}
          </ul>
        </div>
      );
    })
  }

  const renderTaskPopup = (task: TaskInfo[]) => {
    return task.map((taskItem, index) => {
      const content = (
        <div>
          <div>
            <strong>任务时间：</strong>[{taskItem.date[0]}-
            {taskItem.date[1]}]
          </div>
          <div>
            <strong>summary：</strong>
            {taskItem.summary}
          </div>
          <div>
            <strong>story_points：</strong>
            {taskItem.story_points}
          </div>
          <div>
            <strong>状态：</strong>
            {taskItem.status}
          </div>
          <div>
            <strong>研发单：</strong>
            {`[${taskItem.parent_key}]${taskItem.parent_summary}`}
          </div>
          <div>
            {/* <Link
            to={`/detail/${taskItem.jira_key}`}
            target="_blank"
          >
            查看任务详情
          </Link> */}
          </div>
        </div>
      );
      return (
        <Popover content={content} key={index} trigger="hover">
          <li
            style={{
              gridColumn: taskItem.position,
              backgroundColor: Colors[taskItem.status],
              borderTopLeftRadius: taskItem.leftOver ? "0" : "25px",
              borderBottomLeftRadius: taskItem.leftOver
                ? "0"
                : "25px",
              borderBottomRightRadius: taskItem.rightOver
                ? "0"
                : "25px",
              borderTopRightRadius: taskItem.rightOver ? "0" : "25px",
            }}
            key={index}
          >
            {taskItem.summary.replace(reg, "")}
          </li>
        </Popover>
      );
    });
  }

  useEffect(() => {
    getShowData(props.startDate, props.endDate);
    getShowDate(props.startDate, props.endDate);
  }, []);

  return (
    <div className="gantt">
      {renderDataHeader(showDate)}
 
      {renderDataTable(showDate)}

      {renderDataBody(showData)}
    </div>
  );
};

export type { GanttProps };