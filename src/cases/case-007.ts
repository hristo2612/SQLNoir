import type { Case } from "../types";

const blueprintCase: Case = {
  id: "case-007",
  title: "Blueprints Case",
  difficulty: 1,
  description: "Blueprints were stolen at the conference",
  xpReward: 100,
  completed: false,
  isNew: true,
  category: "beginner",
  brief: `A loud group of people passes by, laughing, distracting you from your thoughts.
          You watch them approaching a reception, then look around. You sit in the lobby of
          a busy hotel, with fresh investigation materials in your hands. Your gaze glides
          over the rich interior of the hotel and pauses on a billboard near the entrance.
          The billboard advertises all the companies, participating in conference, which takes
          place here this week. You see the name Energetico - a company, which hired you
          yesterday. Your thoughts bring you back to the job at hands. They were planning a big
          announcement on this conference - an invention, which they claim would revolutionize
          energetic as we know it. They brought blueprints of the invention to the conference,
          to present to investors and fund further development. Somebody stole the blueprints
          yesterday, and that's why you are here.

          You flip a page and read further through the provided materials. The blueprints were
          always under supervision of Energetico employees, except of a one hour period,
          after which the blueprints disappeared. The police investigation so far found that
          someone from the competitors on this conference stole the blueprints. They spoke to
          the hotel guests, and collected alibi of some of them for the time of the theft.
          But the police investigation goes slowly. Today is the last day of the conference,
          and Energetico needs the blueprints back by the evening. That's why they hired you.

          You did some planning yesterday, and now is time to act. You look through
          the objectives you wrote for yourself earlier.`,
  objectives: [
    "The list of `companies` in the main hall should reveal competitors, who present on the conference",
    "The hotel staff are willing to cooperate, and will share the list of `guests`, registered in the hotel during the conference",
    "The police gave you access to the list of `alibi` they collected for some guests. Look for a suspect without an alibi",
  ],
  solution: {
    answer: "Nylah Deitra",
    successMessage: "Congratulations!",
    explanation: `The police ran into the room 320. After searching around, they found
                  the stolen blueprints hidden under the mattress. They arrest Nylah Deitra.
                  Kyla Lissa from Energetico hugs you, thanks you for your work and runs
                  into a conference room, happily singing along the way.

                  You head to the exist, proud of the case you just cracked. As you pass by
                  the billboard in the hall, you once again see the name of Energetico on it.
                  A wide smile appears on your face, and you step out of the building.`,
  },
};

export default blueprintCase;
