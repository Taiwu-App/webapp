export default function bindthis(target: any, name: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  return {
    get() {
      const boundFunc = descriptor.value.bind(this);
      Object.defineProperty(this, name , {
        value: boundFunc
      });
      return boundFunc;
    }
  };
}