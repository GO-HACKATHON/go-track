![GO-TRACK](https://cloud.githubusercontent.com/assets/7076809/24319534/6ebf845c-1151-11e7-81a4-051efbdc0068.png)

# GO-TRACK
This is the centralized mono repository of **GO-TRACK: GO-JEK Tracking as a Service**.

## Content
1. [Introduction](#introduction)
2. How to run
3. API Docs
4. Pitch Deck

## Introduction

### The Background
Tracking is **useful**. There are lots of values from knowing where everything is and where everything moves to. However, **tracking items with GPS trackers is practically hard for several reasons**. Firstly, the devices themselves are very complicated as they consist of GPS receivers packed with GPRS modules, making them cost so high, eat so much space, and consume a lot of powers. In addition, monthly data subscription is also required for each tracking device in order to send us location updates, adding extra pain to the list. 

**Recent tracking technology**, powered with *Bluetooth Low Energy* comes to solve the caveat. They have begun to gain reputation since they would allow super convinient tracking at a much lower costs. The unit costs about $10 when purchased individually and as low as $1 when purchased in mass scale. They do not need any of internet or GPS, making it very simple, take very little space, and last for years without replacing or recharging the battery, thus they could be applied to almost any application, from belongings tracking, children or elderly tracking or as simple as pet tracking.

However, the technology relies on a system called **"Crowd GPS"**. The technology uses a companion app (also used by users to track their devices) to update detected *Tracker*. **This means availability is not guaranteed: no tracking could be performed without active users activating their bluetooth (and apps)**. To give illustration, the following is active TrackR user recorded **in a month** in Jakarta.

![trackrmap](https://cloud.githubusercontent.com/assets/7076809/24319670/113f0c86-1155-11e7-875b-337cfd1ed9f0.png)

## The Proposed Solution
We realize the huge power of GO-JEK fleet, and we will combine that with the power of BLE devices. With the size as big as 200.000 drivers, imagine replacing the power of crowds with GO-JEK riders. The drivers are always moving around the city, with the total distance covered as high as 4.000.000 kilometers per day, so most area of the city will by covered by them.

The idea is simple. We will add additional functionality in the GOJEK driver app. It will detect the nearby BLE devices and tell the server about their location. Using data combined from multiple sources, the server can do some calculation to get a close approximation of the devices' location.

This feature will not change the behavior of the drivers while using the app, as it runs on the background. The only additional thing that they have to do is turning on the bluetooth on their devices. Bluetooth consumes very little energy, so doing this will not affect the battery life much. Additionally, users do not have to move around and turn their bluetooth and GPS on, as GO-JEK drivers will do it for them. 

## ~Business Value~ IMPACT
Talking about business value of **GO-TRACK** is easy. Who does not want to buy trackers at a very low price, let's say IDR 50K or 100K? TrackR has proven this with their 4.5+ m units sold. The most important thing about **GO-TRACK** is its impact that continues to scale as we scale its level usage.

### LEVEL 1: The basics - Know Where Everthing Is
![Level 1](https://cloud.githubusercontent.com/assets/7076809/24320129/8856f048-1161-11e7-8a25-fde8ed6af3d7.png)

It is what we would see in **TrackR** or any other GPS Trackers. **GO-TRACK** could be utilized to track your personal items, vehicles, or pets so you could **know where everything is**.

### LEVEL 2: Protect Your Beloved Ones!
![Level 2](https://cloud.githubusercontent.com/assets/7076809/24320144/01bd592c-1162-11e7-9fe2-0fbab3b5ac0a.png)

It is another level of **GO-TRACK** use cases. We could track our beloved ones, and get alerted if something out of behaviour happened. For example, our kids were supposed to be at school at 7.00 AM and be home at 01.00 PM, if **GO-TRACK** found out that our kids did not at the place they should be, **GO-TRACK** would alert us so that we could take actions as early as possible.

### ULTIMATE LEVEL: Solve Major Cities Problem!
![Ultimate Level](https://cloud.githubusercontent.com/assets/7076809/24320172/a74b57a4-1162-11e7-9fdb-28e288acd029.png)

Let's skip several levels and head to this level. One of the most concerning problem of big cities is transportation, however, we did not have enough data about public trasport such as angkots or city buses although they take major proportion of public transport in Indonesia. Tracking angkots or city buses with GPS Trackers would be practically impossible as it require huge costs, however tracking them with **GO-TRACK** would be practical as it is cheap and does not require maintenance.

Having data about them without doubt useful for the people using public transportation, as they can find out the location of Angkot around the city. People can estimate the time they have to actually go to the bus stop so they can use their time more effectively. Moreover, by aggregating the data, we could analyze the behavior of public transportations. For instance: 

1. We can determine the time Angkot of certain route take
2. How many stops they take and for how long
3. Is there any Angkot that doesn't take the appropriate route, and many more.

It could bring us the big picture of public transportation in a certain city and the government could use the data to make actions and improve the city.
