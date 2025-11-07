import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TabIcon = ({ focused, activeIcon, defaultIcon, label }) => {
  return (
   <SafeAreaView>
    <View style={styles.tabIconContainer}>
      {focused && <View style={styles.activeBar} />}
      <Image 
        source={focused ? activeIcon : defaultIcon}
        style={styles.tabIcon}
        resizeMode="contain"
      />
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
    </SafeAreaView>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
      safeAreaInsets={{ bottom: 0 }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeIcon={require('../../assets/icons/homeselected.png')}
              defaultIcon={require('../../assets/icons/home.png')}
              label="Home"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dishcover"
        options={{
          title: 'Dishcover',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeIcon={require('../../assets/icons/dishcoverselected.png')}
              defaultIcon={require('../../assets/icons/dishcover.png')}
              label="Dishcover"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeIcon={require('../../assets/icons/addselected.png')}
              defaultIcon={require('../../assets/icons/add.png')}
              label="Add"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeIcon={require('../../assets/icons/profileselected.png')}
              defaultIcon={require('../../assets/icons/profile.png')}
              label="Profile"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    height: 108,
    paddingBottom: 9,
    paddingTop: 13,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: -1,
    marginBottom: -32,
  },
  activeBar: {
    position: 'absolute',
    top: -13,
    width: 50,
    height: 6,
    backgroundColor: '#ff4458',
    borderRadius: 5,
  },
  tabIcon: {
    width: 24,
    height: 24,
    marginBottom: 6,
    marginRight: 3,
   
   
    
  },
  tabLabel: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'GoogleSans-Regular',
    marginRight: -23,
    marginLeft: -25,
  },
  tabLabelActive: {
    color: '#ff4458',
    fontWeight: '600',
  },
});