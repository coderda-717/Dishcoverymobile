import { SafeAreaView } from "react-native-safe-area-context"

import { Image, Text } from "react-native";

const Onboard = ()=>{
    return(
        <SafeAreaView style={{backgroundColor:'#fff', flex:1, alignItems:'center', justifyContent:'center'}}>
<Image source={require('../assets/images/image1.png')} style={styles.image1} />
            <Image style={{height:64, width:257, alignSelf:'center'}} source={require('../assets/images/icon.png')}/>
            <Text>Dishcovery</Text>

        </SafeAreaView>
    )
}
export default Onboard;
