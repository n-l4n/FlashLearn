import storage from '@react-native-firebase/storage';

export default class FileUploadHelper {
  static async uploadFile(path, firebasePath, onResult) {
    const fileRef = storage().ref(firebasePath);
    const task = fileRef.putFile(path);
    await task
      .then(async () => {
        onResult(await fileRef.getDownloadURL());
      })
      .catch(() => {
        onResult(null);
      });
  }
}
