import React, { useState, useRef, useEffect } from 'react';
import Animated, { Easing } from 'react-native-reanimated';
import { Text, View, TouchableOpacity } from 'react-native';

const {
  set,
  cond,
  startClock,
  stopClock,
  clockRunning,
  block,
  timing, //Updates position node by running timing based animation from a given position to a destination determined by toValue. The animation is expected to last duration milliseconds and use easing function that could be set to one of the nodes exported by the Easing object. The frameTime node will also get updated and represents the progress of animation in milliseconds (how long the animation has lasted so far), similar to the time node that just indicates the last clock time the animation node has been evaluated. Both of these variables are expected to be reset before restarting the animation. Finally finished node will be set to 1 when the position reaches the final value or when frameTime exceeds duration.
  debug,
  Value,
  Clock, //animated node , the value it returns is the current frame timestamp in milliseconds
} = Animated;
function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: value, //from position given by value
    time: new Value(0),
    frameTime: new Value(0), //frameTime node will also get updated and represents the progress of animation in milliseconds (how long the animation has lasted so far)
  };

  const config = {
    duration: 1000, //animation duration
    toValue: dest, //to position given by dest
    easing: Easing.inOut(Easing.cubic), //easing function
  };
  //block nodes can be used if we want to execute several nodes (commands) in a specific sequence
  return block([
    //check if clock is running already, if not we set variables and start clock
    cond(clockRunning(clock), 0, [
      //cond nodes are equivalent of if ... else
      set(state.finished, 0), //set nodes are equivalent of =
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    timing(clock, state, config), //here we start animation using timing which takes state and config variables
    // cond(!state.finished, debug('animation running')),
    cond(state.finished, debug('stop clock', stopClock(clock))), //if animation is finished ,we stop clock
    state.position, //return position of animated variable which will map to this.heightIncrease
  ]);
}

const Row = ({ title, content, showContent, toggleContent, height }) => {
  return (
    <Animated.View style={{ height: height }}>
      {/*this is title part */}
      <TouchableOpacity
        onPress={() => {
          toggleContent();
        }}>
        <View
          style={{
            backgroundColor: '#8f8f8f',
            height: 50,
            borderColor: 'white',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{ marginLeft: 10, color: 'white', fontSize: 14 }}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
      {/* this is content part */}

      <Animated.ScrollView>
        <Text>{content}</Text>
      </Animated.ScrollView>
    </Animated.View>
  );
};



const Accordion = (props) => {
  const [showContent1, setShowContent1] = useState(false);
  const [showContent2, setShowContent2] = useState(false);
  const [showContent3, setShowContent3] = useState(false);

  //instance varible for Row height
  let heightRow1 = useRef(new Value(50));
  let heightRow2 = useRef(new Value(50));
  let heightRow3 = useRef(new Value(50));

  const toggleRow1Content = () => {

    if (!showContent1) {
      heightRow1.current = runTiming(new Clock(), new Value(50), new Value(200));
    } else {
      heightRow1.current = runTiming(new Clock(), new Value(200), new Value(50));
    }
    if (showContent2) {
      heightRow2.current = runTiming(new Clock(), new Value(200), new Value(50));
    }
    if (showContent3) {
      heightRow3.current = runTiming(new Clock(), new Value(200), new Value(50));
    }
    setShowContent1(!showContent1);
    setShowContent2(false);
    setShowContent3(false);
  };

  const toggleRow2Content = () => {
    if (!showContent2) {
      heightRow2.current = runTiming(new Clock(), new Value(50), new Value(200));
    } else {
      heightRow2.current = runTiming(new Clock(), new Value(200), new Value(50));
    }
    if (showContent1) {
      heightRow1.current = runTiming(new Clock(), new Value(200), new Value(50));
    }
    if (showContent3) {
      heightRow3.current = runTiming(new Clock(), new Value(200), new Value(50));
    }
    setShowContent1(false);
    setShowContent2(!showContent2);
    setShowContent3(false);
  };

  const toggleRow3Content = () => {
    if (!showContent3) {
      heightRow3.current = runTiming(new Clock(), new Value(50), new Value(200));
    } else {
      heightRow3.current = runTiming(new Clock(), new Value(200), new Value(50));
    }
    if (showContent1) {
      heightRow1.current = runTiming(new Clock(), new Value(200), new Value(50));
    }
    if (showContent2) {
      heightRow2.current = runTiming(new Clock(), new Value(200), new Value(50));
    }
    setShowContent1(false);
    setShowContent2(false);
    setShowContent3(!showContent3);
  };


  return (
    <View
      style={{
        margin: 20,
        borderRadius: 10,
        borderWidth: 1,
        overflow: 'hidden',
        borderColor: '#00000',
      }}>
      <Row
        height={heightRow1.current}
        content="This is first row"
        title="Row 1"
        showContent={showContent1}
        toggleContent={toggleRow1Content}
      />
      <Row
        height={heightRow2.current}
        content="This is second row"
        title="Row 2"
        showContent={showContent2}
        toggleContent={toggleRow2Content}
      />
      <Row
        height={heightRow3.current}
        content="This is third row"
        title="Row 3"
        showContent={showContent3}
        toggleContent={toggleRow3Content}
      />
    </View>
  );
}

export default Accordion