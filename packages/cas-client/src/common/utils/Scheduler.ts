import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import { gcd } from './gcd'

export type TaskCallback = (experiencedTime: number) => any

export type TaskConfig = OnceTaskConfig | IntervalTaskConfig
/**
 * 类似于 setTimeout， 仅仅执行一次。
 *
 * @export
 * @interface OnceTaskConfig
 */
export interface OnceTaskConfig {
  id?: string
  onComplete: () => any
  totalPeriod: number
}

/**
 * 类似于 setInterval, 但是多了一个可选的 totalPeriod 以及 onComplete 回调
 *
 * @export
 * @interface IntervalTaskConfig
 */
export type IntervalTaskConfig = {
  id?: string
  intervalPeriod: number
  intervalCallback: TaskCallback
  onComplete?: () => any
  totalPeriod?: number
}

function isIntervalTaskConfig(task: TaskConfig): task is IntervalTaskConfig {
  return (
    Object.hasOwnProperty.call(task, 'intervalPeriod') &&
    Object.hasOwnProperty.call(task, 'intervalCallback')
  )
}

/**
 * 基本间隔周期 10 ms,
 * 出于浏览器规范兼容性，以及便于计算的同时不影响准确性等多方考虑，基本间隔周期为 10 ms
 */
export const BASE_PERIOD = 10

export type SchedulerTask = InstanceType<typeof Scheduler.Task>

export interface SchedulerTasks {
  [id: string]: SchedulerTask
}

/**
 * 任务管理类，用于监听倒计时并管理任务表
 */
export class Scheduler {
  // 任务表，id-value结构，任务都有唯一对应的id
  private tasks: SchedulerTasks

  // 计数器，用于生成分配任务对应的id
  private counter: number

  // 监听者，可用于关闭对任务的监听
  private listener?: ReturnType<typeof setInterval>

  // 优化场景，如果有多个任务的间隔周期都是 10，或者 10的倍数，可以直接将基础间隔周期 * 10 来进行优化
  private multiple = 1

  public get realInterval() {
    return this.multiple * BASE_PERIOD
  }

  /**
   * 私有化构造方法，避免用户手动构造
   */
  private constructor() {
    this.counter = 0
    this.tasks = {}
  }

  public static Task = class {
    // 可选的 id ，考虑到可能有指定 id 来方便进行任务的中断场景
    public id: string | undefined

    public intervalCallback?: TaskCallback

    public onComplete?: () => any

    // 一共要执行多个少个间隔周期
    public totalPeriod?: number

    // 每多少个间隔周期执行一次 intervalCallback
    public intervalPeriod?: number

    // 当前时刻，该任务已经经历过的周期数
    public experiencedPeriod: number

    /**
     * check totalPeriod >= 1  整数 并且 totalPeriod >= intervalPeriod
     *
     * @private
     */
    private checkTotalPeriod() {
      if (this.totalPeriod !== undefined) {
        if (
          this.totalPeriod < (this.intervalPeriod ?? 1) ||
          !Number.isInteger(this.totalPeriod)
        ) {
          throw new Error('Illegal SchedulerTask config: totalPeriod')
        }
      }
    }

    /**
     * check intervalPeriod >= 1 整数
     *
     * @private
     */
    private checkIntervalPeriod() {
      if (this.intervalPeriod !== undefined) {
        if (this.intervalPeriod < 1 || !Number.isInteger(this.intervalPeriod)) {
          throw new Error('Illegal SchedulerTask config: intervalPeriod')
        }
      }
    }

    /**
     * 创建一个任务需要的参数.
     * @param {TaskConfig} config
     * @param config.id 如果自行指定 id ，由用户来确保 id 的唯一性
     * @param config.totalPeriod 倒计时周期数，必须为 >= 0 的整数
     * @param config.onComplete? 倒计时结束执行的回调
     * @param config.callback? 每间隔周期执行的回调
     * @param config.intervalPeriod 任务间隔周期时长，必须为 >= 1 的整数
     * @memberof Task
     */
    public constructor(config: TaskConfig) {
      const { totalPeriod, onComplete, id } = config
      this.totalPeriod = totalPeriod
      this.onComplete = onComplete
      this.id = id
      if (isIntervalTaskConfig(config)) {
        const { intervalCallback, intervalPeriod } = config
        this.intervalPeriod = intervalPeriod
        this.intervalCallback = intervalCallback
      }
      this.checkTotalPeriod()
      this.checkIntervalPeriod()
      this.experiencedPeriod = 0
    }
  }

  /**
   * 监听执行时每秒进行的操作。
   * 如果是同步任务，需要考虑不能被阻塞
   */
  private action = () => {
    const completedTasks: string[] = []
    const actions = map(this.tasks, async (task, id) => {
      task.experiencedPeriod += this.multiple
      // 如果到了周期任务的执行时间
      if (
        task.intervalPeriod &&
        task.intervalCallback &&
        task.experiencedPeriod % task.intervalPeriod === 0
      ) {
        task.intervalCallback(task.experiencedPeriod * BASE_PERIOD)
      }
      // 如果任务完成，执行 onComplete 回调，并且加入停止队列
      if (task.totalPeriod === task.experiencedPeriod) {
        task.onComplete?.()
        completedTasks.push(id)
      }
    })
    Promise.all(actions)
    this.stopTasks(...completedTasks)
  }

  /**
   * 开始监听倒计时
   */
  private listen() {
    this.stopListen()
    this.listener = setInterval(this.action, this.realInterval)
  }

  /**
   * 停止监听
   */
  private stopListen() {
    if (this.listener) {
      clearInterval(this.listener)
      this.listener = undefined
    }
  }

  /**
   * 判断是否任务全部结束，如果是可以停止监听
   */
  private judgeAndStop() {
    if (isEmpty(this.tasks)) {
      this.stopListen()
    }
  }

  /**
   * 停止已完成的任务队列
   * @param taskIds 已完成的任务队列
   */
  public stopTasks(...taskIds: string[]) {
    taskIds.forEach((taskId) => {
      delete this.tasks[taskId]
    })
    this.judgeAndStop()
  }

  /**
   * 将待进行的任务列表存入并交由任务管理类管理
   *
   * @static
   * @param {...SchedulerTask[]} tasks
   * @returns
   * @memberof Scheduler
   */
  public static spawnTasks(...tasks: SchedulerTask[]) {
    const instance = new Scheduler()
    const currentIds: string[] = []
    const intervals: number[] = []
    tasks.forEach((task) => {
      const id = task.id ?? `Scheduler-Task-${instance.counter}`
      instance.tasks[id] = task
      instance.counter += 1
      currentIds.push(id)
      // 记录间歇周期 和 总周期数，方便判断最合适的执行周期
      if (task.intervalPeriod && task.intervalCallback) {
        intervals.push(task.intervalPeriod)
      }
      if (task.totalPeriod) {
        intervals.push(task.totalPeriod)
      }
    })
    if (!isEmpty(intervals)) {
      // 优化轮询次数
      instance.multiple = gcd(...intervals)
    }
    if (!isEmpty(currentIds)) {
      // 只有存在任务时才需要启动定时器
      instance.listen()
    }
    return {
      instance,
      // 方便调用者根据 id 强行中断相应的任务
      taskIds: currentIds,
    }
  }

  /**
   * 判断是否有任务正在执行
   */
  public get isListening() {
    return !!this.listener
  }
}
