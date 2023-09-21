class Person {
    //name = filed 멤버변수
    name: string;
    
    //멤버 생성자
    constructor(name: string) {
      this.name = name;
    }
  
    //멤버 메서드
    say() {
      console.log(`my name is ${this.name}`);
    }
  }
  
  const hsm = new Person('하성민');
  hsm.say();
  