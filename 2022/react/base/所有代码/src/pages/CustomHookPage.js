import React, { useState, useEffect } from "react";

export default function CustomHookPage(props) {
  //定义一个叫count的state变量，初始化为0
  const [count, setCount] = useState(0);
  // 错误使用
  // if (count) {
  //   const [num, setNum] = useState(0);
  // }
  //和didMount、didUpdate类似
  useEffect(() => {
    console.log("count effect");
    // 只需要在count发生改变的时候执行就可以啦
    document.title = `点击了${count}次`;
  }, [count]);

  return (
    <div>
      <h3>CustomHookPage</h3>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>add</button>
      <p>{useClock().toLocaleTimeString()}</p>
    </div>
  );
}

// 错误使用
// function getNum() {
//   const [num, setNum] = useState(0);

//   return num;
// }

// 自定义一个hook，命名要以use开头
function useClock() {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    console.log("date effect");
    //只需要在didMount时候执行就可以了
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    //清除定时器，类似willUnmount
    return () => clearInterval(timer);
  }, []);
  return date;
}
