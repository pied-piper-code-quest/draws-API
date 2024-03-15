export class Validators {
  static isEmail(value: string) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(value);
  }
  static isPhone(value: string) {
    const phoneRegex = /^\+?([0-9]{1,2})\)?([0-9]{10})$/;
    return phoneRegex.test(value);
  }
  static isBoolean(value: any) {
    return typeof value === "boolean";
  }
  static isNumber(value: any) {
    return !isNaN(+value);
  }
  static isDate(value: any) {
    const parseDate = new Date(value).toString();
    return parseDate !== "Invalid Date";
  }
  static dateIsAfterOfToday(date: string) {
    const now = Date.now();
    const dateValue = new Date(date).getTime();
    return dateValue > now;
  }
  static dateIsAfterOf(date: string, toCompare: string) {
    const dateValue = new Date(date).getTime();
    const toCompareValue = new Date(toCompare).getTime();
    return dateValue > toCompareValue;
  }
}
