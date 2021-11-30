import React, { useState, useEffect } from "react";

export default function HookPage(props) {
  //定义一个叫count的state变量，初始化为0
  const [count, setCount] = useState(0);
  const [date, setDate] = useState(new Date());
  //和didMount、didUpdate类似
  useEffect(() => {
    console.log("count effect");
    // 只需要在count发生改变的时候执行就可以啦
    document.title = `点击了${count}次`;
  }, [count]);

  useEffect(() => {
    console.log("date effect");
    //只需要在didMount时候执行就可以了
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    //清除定时器，类似willUnmount
    return () => clearInterval(timer);
  }, []);
  return (
    <div>
      <h3>HookPage</h3>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>add</button>
      <p>{date.toLocaleTimeString()}</p>
    </div>
  );
}
