# GO-TRACK
This is the centralized mono repository of **GO-TRACK: GO-JEK Tracking as a Service**.

![gotrack2](https://cloud.githubusercontent.com/assets/7076809/24319534/6ebf845c-1151-11e7-81a4-051efbdc0068.png)

## Content
1. [Introduction](#introduction)
2. How to run
3. API Docs

## Introduction

### The Background
Tracking is **useful**. There are lots of values from knowing where everything is and where everything moves to. However, **tracking items with GPS trackers is practically hard for several reasons**. Firstly, the devices themselves are very complicated as they consist of GPS receivers packed with GPRS modules, making them cost so high, eat so much space, and consume a lot of powers. In addition, monthly data subscription is also required for each tracking device in order to send us location updates, adding extra pain to the list. 

**Recent tracking technology**, powered with *Bluetooth Low Energy* comes to solve the caveat. They have begun to gain reputation since they would allow super convinient tracking at a much lower costs. The unit costs about $10 when purchased individually and as low as $1 when purchased in mass scale. They do not need any of internet or GPS, making it very simple, take very little space, and last for years without replacing or recharging the battery, thus they could be applied to almost any application, from belongings tracking, children or elderly tracking or as simple as pet tracking.

However, the technology relies on a system called **"Crowd GPS"**. The technology uses a companion app (also used by users to track their devices) to update detected *Tracker*. **This means availability is not guaranteed: no tracking could be performed without active users activating their bluetooth (and apps)**. To give illustration, the following is active TrackR user recorded **in a month** in Jakarta.