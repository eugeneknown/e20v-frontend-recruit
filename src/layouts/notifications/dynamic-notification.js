import { useState, useEffect } from "react";

import MDSnackbar from "components/MDSnackbar";


function Notifications({ data }) {
  const [state, setState] = useState(false);
  const [props, setProps] = useState()

  const open = () => setState(true);
  const close = () => setState(false);

  useEffect(() => {
    console.log('debug dynamic notification data:', data)
    open()

  },[data])

  if ( data != undefined ) {
    return (
        <MDSnackbar
          {...data}
        //   color="success"
        //   icon="check"
        //   title="Material Dashboard"
        //   content="Hello, world! This is a notification message"
        //   dateTime="11 mins ago"
          open={state}
          onClose={close}
          close={close}
        />
      )
  }
}

export default Notifications;
