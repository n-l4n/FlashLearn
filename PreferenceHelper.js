import DefaultPreference from 'react-native-default-preference';

export default class Pref {
  static async get(key: string, defValue: any) {
    let val = await DefaultPreference.get(key);
    val = val ? val : defValue;
    console.log(val);
    return val;
  }

  static async set(key: string, val: any) {
    await DefaultPreference.set(key, val);
  }
}
