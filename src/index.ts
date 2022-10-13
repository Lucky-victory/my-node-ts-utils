import flatten from "just-flatten-it";
import isEmpty from "just-is-empty";
import merge from "just-merge";
import omit from "just-omit";
import pick from "just-pick";

import { v4 as uuid } from "uuid";

export class MyUtils {
  static merge<T extends object, O extends object[], R extends object>(
    obj: T,
    ...objs: O
  ): R {
    return merge(obj, ...objs) as unknown as R;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static flatten<R = any>(arr: any): R[] {
    return flatten(arr);
  }
  static omit<T extends object>(obj: T | T[], remove: (keyof T)[] | string[]) {
    if (Array.isArray(obj)) {
      return obj.map((item) => {
        return omit(item, remove as (keyof T)[]);
      });
    }
    return omit(obj, remove as (keyof T)[]);
  }
  static pick<T extends object>(obj: T | T[], select: (keyof T)[] | string[]) {
    if (Array.isArray(obj)) {
      return obj.map((item) => {
        return pick(item as T, select as (keyof T)[]);
      });
    }
    return pick(obj, select as (keyof T)[]);
  }

  /**
   * converts a string to lowercase
   * @param val
   * @returns
   */
  static lower(val: string) {
    return val && String(val).toLowerCase().trim();
  }
  static isEmpty(val: any) {
    return isEmpty(val);
  }
  /**
   * converts a string to uppercase
   * @param val
   * @returns
   */
  static upper(val: string) {
    return val && String(val).toLowerCase().trim();
  }
  static removeSpaces(val: string) {
    return String(val).split(" ").join("").trim();
  }

  /**
   * generate a UUID,
   * @param dashes - whether to remove the dash delimiters
   */
  static generateID(dashes = true) {
    return dashes ? uuid() : uuid().replace(/-/g, "");
  }

  static get currentTime() {
    return new Date();
  }

  /**
   * Merges and Nest an array of objects based on a matched key value
   * @param outer -
   * @param inner
   * @param options -
   * @returns
   */
  static arrayMergeObject<O = object[], I = object[], R = object[]>(
    outer: O,
    inner: I,
    options: Partial<IArrayMergeOptions> = {}
  ): R | [] {
    if (!(Array.isArray(outer) && Array.isArray(inner))) {
      return [];
    }
    const {
      innerTitle = "nested",
      outerProp = "id",
      innerProp = "id",
    } = options;
    const result = outer.map((item) => {
      return {
        ...item,
        [innerTitle]: {
          ...inner.reduce((accum, inItem) => {
            return item[outerProp] === inItem[innerProp] ? inItem : accum;
          }, {}),
        },
      };
    });
    return result as unknown as R;
  }

  /**
   * Merges and Nest an array of objects based on a matched key value
   * @param outer - the main array
   * @param inner - the array to be nested
   * @param options -
   * @returns
   */
  static arrayMerge<O = object[], I = object[], R = object[]>(
    outer: O,
    inner: I,
    options: Partial<IArrayMergeOptions> = {}
  ): R | [] {
    if (!(Array.isArray(outer) && Array.isArray(inner))) {
      return [];
    }

    const {
      innerTitle = "nested",
      outerProp = "id",
      innerProp = "id",
    } = options;
    const result = outer.map((item) => {
      return {
        ...item,
        [innerTitle]: [
          ...inner.reduce((accum, inItem) => {
            item[outerProp] === inItem[innerProp] ? accum.push(inItem) : accum;
            return accum;
          }, []),
        ],
      };
    });
    return result as unknown as R;
  }
  /**
   * Returns time in the following format - `00:00:00` , suitable for players / timers
   * @param seconds - time in seconds
   * @returns
   */
  static secondsToTime(seconds: number) {
    if (!seconds) return "00:00";
    const add0 = (num: number): string => (num < 10 ? "0" + num : "" + num);
    const secondsInOneHour: number = 3600;
    const hour: number = Math.floor(seconds / secondsInOneHour);
    const minute: number = Math.floor((seconds - hour * secondsInOneHour) / 60);
    const sec = Math.floor(seconds - hour * secondsInOneHour - minute * 60);

    return (hour > 0 ? [hour, minute, sec] : [minute, sec]).map(add0).join(":");
  }
  /**
   * Returns an array of random index
   * @param length - the length of the array
   * @returns
   */
  static randomOrder(length: number) {
    return MyUtils.shuffle([...Array(length)].map((_, i) => i));
  }
  /**
   * Shuffles an array
   * @param arr
   * @returns
   */
  static shuffle(arr: number[]) {
    const _arr = [...arr];
    for (let i = _arr.length - 1; i >= 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [_arr[i], _arr[rand]] = [_arr[rand], _arr[i]];
    }
    return arr;
  }
}

interface IArrayMergeOptions {
  outerProp: string;
  innerProp: string;
  innerTitle: string;
}
