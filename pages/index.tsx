import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect, FC } from "react";
import { Appointment } from "./types";
import { Scheduler, ScheduleSpecificDate } from "@ssense/sscheduler";
import {
  Box,
  Heading,
  VStack,
  Button,
  HStack,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  InputRightElement,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputLeftElement,
  InputGroup,
  Input,
} from "@chakra-ui/react";
import { TimeIcon } from "@chakra-ui/icons";

// exemplary response
// [
//   {
//     "name": "Lunch with Mort",
// 	"startTime": "2021-03-03T12:00:00+0000",
//     "endTime": "2021-03-03T13:00:00+0000"
//   },
//   {
//     "name": "Morning Meeting",
// 	"startTime": "2021-03-03T09:00:00+0000",
//     "endTime": "2021-03-03T09:30:00+0000"
//   },
//   {
//     "name": "Exit Interviews",
// 	"startTime": "2021-03-03T14:00:00+0000",
//     "endTime": "2021-03-03T17:30:00+0000"
//   },
//   {
// 	"name": "Exit Interview - Jack Sparrow",
// 	"startTime": "2021-03-03T15:30:00+0000",
//     "endTime": "2021-03-03T15:45:00+0000"
//   }
// ]

const STARTING_HOUR = 8;

const scheduler = new Scheduler();

const AvailableTimeSlots: FC<{ url: string; date: string }> = ({ url, date }) => {
  const [existingAppointments, setExistingAppointments] = useState<ScheduleSpecificDate[] | null>(
    null
  );
  const [meetingDuration, setMeetingDuration] = useState(60); //min
  const [meetingInterval, setIntervalDuration] = useState(30); //min

  const [[timeFrom, timeTo], setTimeFromTo] = useState([60, 540]); //min

  const parsedDate = new Date(date);
  const nextDay = new Date(parsedDate.setDate(parsedDate.getDate() + 1)).toISOString();

  useEffect(() => {
    fetch(url)
      .then(appointments => appointments.json())
      .then(({ appointments }) =>
        setExistingAppointments(
          appointments.map(({ startTime, endTime }: Appointment) => ({
            from: startTime,
            to: endTime,
          }))
        )
      )
      .catch(err => console.log(err));
  }, [url]);

  // Time added to the starting point in minutes
  const getTime = (addedTime: number) => {
    const startingPoint = new Date(parsedDate.setHours(STARTING_HOUR));

    const chosenPoint = new Date(
      startingPoint.setMinutes(parsedDate.getMinutes() + addedTime)
    ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return chosenPoint;
  };

  const availabilitySlots =
    existingAppointments &&
    scheduler.getAvailability({
      from: date,
      to: nextDay,
      duration: meetingDuration,
      interval: meetingInterval,
      schedule: {
        weekdays: {
          from: getTime(timeFrom),
          to: getTime(timeTo),
        },
        unavailability: existingAppointments,
      },
    });

  return (
    <div>
      <Head>
        <title>Become a time-master</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        w="100%"
        minH="100vh"
        d="flex"
        justifyContent="center"
        bgGradient={[
          "linear(to-tr, teal.300, yellow.400)",
          "linear(to-t, blue.200, teal.500)",
          "linear(to-b, orange.100, purple.300)",
        ]}
      >
        <Box width="25vw" height="60vh" padding={2} mt="15vh">
          <Heading as="h2" size="2xl" mb={8}>
            We're time-masters, let us save the day! And your time!
          </Heading>

          <HStack spacing={2} h="full">
            <VStack spacing={8} w="full" h="full" alignItems="flex-start">
              <VStack spacing={2} alignItems="flex-start">
                <Heading as="h3" size="md">
                  Appointment date
                </Heading>

                <Heading as="h4" size="sm">
                  <TimeIcon w={6} h={6} mr="2" />
                  {date}
                </Heading>
              </VStack>

              <VStack spacing={2}>
                <Heading as="h3" size="md">
                  Hours to choose from
                </Heading>

                <HStack spacing={2}>
                  <Input isReadOnly value={getTime(timeFrom)} />

                  <Input isReadOnly value={getTime(timeTo)} />
                </HStack>

                <RangeSlider
                  defaultValue={[60, 540]}
                  min={0}
                  max={720} // min from starting point (20:00)
                  step={30}
                  onChangeEnd={setTimeFromTo}
                >
                  <RangeSliderTrack bg="red.100">
                    <RangeSliderFilledTrack bg="pink.500" />
                  </RangeSliderTrack>

                  <RangeSliderThumb boxSize={6} index={0} />

                  <RangeSliderThumb boxSize={6} index={1} />
                </RangeSlider>
              </VStack>

              <VStack spacing={2} w="full" alignItems="flex-start">
                <Heading as="h3" size="md">
                  New meeting duration
                </Heading>

                <InputGroup>
                  <InputRightElement
                    pointerEvents="none"
                    color="black.500"
                    fontSize="1em"
                    children="min"
                    top="16px"
                  />

                  <NumberInput
                    isReadOnly
                    fontSize="1.5em"
                    mt="4"
                    display="block"
                    defaultValue={60}
                    w={100}
                    value={meetingDuration}
                  >
                    <NumberInputField />
                  </NumberInput>
                </InputGroup>

                <Slider
                  aria-label="meeting-duration-slider"
                  colorScheme="pink"
                  defaultValue={60}
                  step={30}
                  min={30}
                  max={180}
                  onChangeEnd={setMeetingDuration}
                >
                  <SliderTrack bg="red.100">
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </VStack>

              <VStack spacing={2} w="full" alignItems="flex-start">
                <Heading as="h3" size="md">
                  Meetings interval
                </Heading>

                <InputGroup>
                  <InputRightElement
                    pointerEvents="none"
                    color="black.500"
                    fontSize="1em"
                    children="min"
                    top="16px"
                  />

                  <NumberInput
                    isReadOnly
                    fontSize="1.5em"
                    mt="4"
                    display="block"
                    defaultValue={30}
                    w={100}
                    value={meetingInterval}
                  >
                    <NumberInputField />
                  </NumberInput>
                </InputGroup>

                <Slider
                  aria-label="meeting-duration-slider"
                  colorScheme="pink"
                  defaultValue={30}
                  step={15}
                  min={15}
                  max={180}
                  onChangeEnd={setIntervalDuration}
                >
                  <SliderTrack bg="red.100">
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </VStack>
            </VStack>

            <VStack w="full" h="full" overflow="auto">
              {availabilitySlots &&
                availabilitySlots[date].map(slot => (
                  <Button key={slot.time} disabled={!slot.available} h="auto">
                    {slot.time}
                  </Button>
                ))}
            </VStack>
          </HStack>
        </Box>
      </Box>
    </div>
  );
};

const Home: NextPage = () => {
  return <AvailableTimeSlots url="/api/appointments" date="2021-03-03" />;
};

export default Home;
