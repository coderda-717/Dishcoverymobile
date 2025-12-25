import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

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
  const [fontsLoaded] = useFonts({
    'GoogleSans-Regular': require('../../assets/fonts/GoogleSans-Regular.ttf'),
    'GoogleSans-Medium': require('../../assets/fonts/GoogleSans-Medium.ttf'),
    'GoogleSans-Bold': require('../../assets/fonts/GoogleSans-Bold.ttf'),
  });

  // Show loading while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff4458" />
      </View>
    );
  }

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    height: 108,
    paddingBottom: 9,
    paddingTop: 12,
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