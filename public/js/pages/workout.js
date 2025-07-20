import { AppState, showToast, updateGlobalState, API_BASE_URL } from '../common.js';

// --- STATIC DATA ---
const muscleGroupMapping = { 'bench press': 'Chest', 'barbell bench press': 'Chest', 'dumbbell bench press': 'Chest', 'incline bench press': 'Chest', 'incline barbell bench press': 'Chest', 'incline dumbbell bench press': 'Chest', 'decline bench press': 'Chest', 'decline barbell bench press': 'Chest', 'decline dumbbell bench press': 'Chest', 'machine bench press': 'Chest', 'smith machine bench press': 'Chest', 'close grip bench press': 'Chest', 'wide grip bench press': 'Chest', 'push-up': 'Chest', 'incline push-up': 'Chest', 'decline push-up': 'Chest', 'diamond push-up': 'Chest', 'wide push-up': 'Chest', 'weighted push-up': 'Chest', 'plyometric push-up': 'Chest', 'archer push-up': 'Chest', 'one-arm push-up': 'Chest', 'fly': 'Chest', 'dumbbell fly': 'Chest', 'incline dumbbell fly': 'Chest', 'decline dumbbell fly': 'Chest', 'cable fly': 'Chest', 'cable crossover': 'Chest', 'low cable crossover': 'Chest', 'high cable crossover': 'Chest', 'machine fly': 'Chest', 'pec deck': 'Chest', 'svend press': 'Chest', 'floor press': 'Chest', 'barbell floor press': 'Chest', 'dumbbell floor press': 'Chest', 'chest dip': 'Chest', 'weighted chest dip': 'Chest', 'around the world': 'Chest', 'cable press': 'Chest', 'standing cable press': 'Chest', 'kneeling cable press': 'Chest', 'single arm cable press': 'Chest', 'landmine press': 'Chest', 'squeeze press': 'Chest', 'guillotine press': 'Chest', 'reverse grip bench press': 'Chest', 'spoto press': 'Chest', 'larsen press': 'Chest', 'bradford press': 'Chest', 'dumbbell squeeze press': 'Chest', 'plate press': 'Chest', 'resistance band push-up': 'Chest', 'resistance band chest press': 'Chest', 'resistance band fly': 'Chest', 'kettlebell floor press': 'Chest', 'kettlebell push-up': 'Chest', 'champagne press': 'Chest', 'chaos push-up': 'Chest', 'deficit push-up': 'Chest', 'single-arm dumbbell bench press': 'Chest', 'alternating dumbbell bench press': 'Chest', 'stability ball dumbbell press': 'Chest', 'stability ball push-up': 'Chest', 'medicine ball push-up': 'Chest', 'bosu ball push-up': 'Chest', 'cable iron cross': 'Chest', 'incline cable fly': 'Chest', 'decline cable fly': 'Chest', 'bodyweight fly': 'Chest', 'isometric chest squeeze': 'Chest', 'static hold push-up': 'Chest', 'explosive push-up': 'Chest', 'staggered hand push-up': 'Chest', 'cross body push-up': 'Chest', 'sphinx push-up': 'Chest', 'dive bomber push-up': 'Chest', 'incline squeeze press': 'Chest', 'cable chest press': 'Chest', 'seated machine chest press': 'Chest', 'incline machine chest press': 'Chest', 'standing landmine press': 'Chest', 'kneeling landmine press': 'Chest', 'single arm landmine press': 'Chest', 'barbell pullover': 'Chest', 'dumbbell pullover': 'Chest', 'straight-arm dumbbell pullover': 'Chest', 'bent-arm dumbbell pullover': 'Chest', 'cable pullover': 'Chest', 'machine pullover': 'Chest', 'close-grip dumbbell press': 'Chest', 'neutral-grip dumbbell press': 'Chest', 'crush grip dumbbell press': 'Chest', 'hex press': 'Chest', 'v-bar pushdown for chest': 'Chest', 'smith machine incline press': 'Chest', 'smith machine decline press': 'Chest', 'band-assisted dip': 'Chest', 'band-resisted dip': 'Chest', 'trx push-up': 'Chest', 'trx chest press': 'Chest', 'trx fly': 'Chest', 'isometric dip hold': 'Chest', 'partial range bench press': 'Chest', 'pin press': 'Chest', 'board press': 'Chest', 'reverse band bench press': 'Chest', 'chain bench press': 'Chest', 'bottoms-up press': 'Chest', 'glute bridge floor press': 'Chest', 'single leg glute bridge floor press': 'Chest', 'isometric fly hold': 'Chest', 'cable floor press': 'Chest', 'landmine rainbow': 'Chest', 'medicine ball chest pass': 'Chest', 'wall push-up': 'Chest', 'kneeling push-up': 'Chest', 'incline plate press': 'Chest', 'decline plate press': 'Chest', 'cable incline press': 'Chest', 'cable decline press': 'Chest', 'single arm machine press': 'Chest', 'alternating machine press': 'Chest', 'iso-lateral chest press': 'Chest', 'iso-lateral incline press': 'Chest', 'iso-lateral decline press': 'Chest', 'converging chest press': 'Chest', 'converging incline press': 'Chest', 'standing plate press': 'Chest', 'dumbbell bench press with neutral grip': 'Chest', 'incline dumbbell press with neutral grip': 'Chest', 'decline dumbbell press with neutral grip': 'Chest', 'stability ball dumbbell fly': 'Chest', 'one-arm medicine ball push-up': 'Chest', 'assisted one-arm push-up': 'Chest', 'incline archer push-up': 'Chest', 'decline archer push-up': 'Chest', 'pull-up': 'Back', 'weighted pull-up': 'Back', 'chin-up': 'Back', 'weighted chin-up': 'Back', 'neutral grip pull-up': 'Back', 'wide grip pull-up': 'Back', 'close grip pull-up': 'Back', 'assisted pull-up': 'Back', 'banded pull-up': 'Back', 'machine assisted pull-up': 'Back', 'lat pulldown': 'Back', 'wide grip lat pulldown': 'Back', 'close grip lat pulldown': 'Back', 'neutral grip lat pulldown': 'Back', 'reverse grip lat pulldown': 'Back', 'single arm lat pulldown': 'Back', 'kneeling lat pulldown': 'Back', 'straight arm pulldown': 'Back', 'row': 'Back', 'barbell row': 'Back', 'bent over barbell row': 'Back', 'pendlay row': 'Back', 'yates row': 'Back', 'dumbbell row': 'Back', 'single arm dumbbell row': 'Back', 'two arm dumbbell row': 'Back', 'incline dumbbell row': 'Back', 'chest supported row': 'Back', 't-bar row': 'Back', 'landmine row': 'Back', 'meadows row': 'Back', 'cable row': 'Back', 'seated cable row': 'Back', 'wide grip seated cable row': 'Back', 'close grip seated cable row': 'Back', 'neutral grip seated cable row': 'Back', 'single arm cable row': 'Back', 'standing cable row': 'Back', 'high cable row': 'Back', 'face pull': 'Back', 'machine row': 'Back', 'seated machine row': 'Back', 'high machine row': 'Back', 'iso-lateral machine row': 'Back', 'deadlift': 'Back', 'conventional deadlift': 'Back', 'sumo deadlift': 'Back', 'romanian deadlift': 'Back', 'stiff-legged deadlift': 'Back', 'trap bar deadlift': 'Back', 'hex bar deadlift': 'Back', 'dumbbell deadlift': 'Back', 'single leg deadlift': 'Back', 'good morning': 'Back', 'barbell good morning': 'Back', 'seated good morning': 'Back', 'back extension': 'Back', 'hyperextension': 'Back', 'weighted back extension': 'Back', 'reverse hyperextension': 'Back', 'shrug': 'Back', 'barbell shrug': 'Back', 'dumbbell shrug': 'Back', 'machine shrug': 'Back', 'trap bar shrug': 'Back', 'cable shrug': 'Back', 'overhead shrug': 'Back', 'farmer\'s walk': 'Back', 'farmer\'s carry': 'Back', 'rack pull': 'Back', 'block pull': 'Back', 'snatch grip deadlift': 'Back', 'clean grip deadlift': 'Back', 'renegade row': 'Back', 'inverted row': 'Back', 'bodyweight row': 'Back', 'trx row': 'Back', 'ring row': 'Back', 'kroc row': 'Back', 'seal row': 'Back', 'chinese row': 'Back', 'barbell pullover': 'Back', 'dumbbell pullover': 'Back', 'cable pullover': 'Back', 'bird dog': 'Back', 'superman': 'Back', 'archer pull-up': 'Back', 'muscle-up': 'Back', 'bar muscle-up': 'Back', 'ring muscle-up': 'Back', 'kipping pull-up': 'Back', 'butterfly pull-up': 'Back', 'towel pull-up': 'Back', 'rope climb': 'Back', 'pegboard climb': 'Back', 'single arm chin-up': 'Back', 'front lever raise': 'Back', 'back lever raise': 'Back', 'scapular pull-up': 'Back', 'scapular retraction': 'Back', 'band pull-apart': 'Back', 'thoracic extension': 'Back', 'cat-cow': 'Back', 'dead hang': 'Back', 'active hang': 'Back', 'jefferson curl': 'Back', 'zercher deadlift': 'Back', 'zercher good morning': 'Back', 'behind the back shrug': 'Back', 'kirk shrug': 'Back', 'kelso shrug': 'Back', 'single-arm barbell row': 'Back', 'chest-supported t-bar row': 'Back', 'standing t-bar row': 'Back', 'helms row': 'Back', 'spider crawl': 'Back', 'wall slide': 'Back', 'prone cobra': 'Back', 'lu raise': 'Back', 'powell raise': 'Back', 'dumbbell pullover on ball': 'Back', 'single arm machine lat pulldown': 'Back', 'diverging lat pulldown': 'Back', 'converging row machine': 'Back', 'decline dumbbell pullover': 'Back', 'incline bench pull': 'Back', 'gorilla row': 'Back', 'tripod dumbbell row': 'Back', 'resistance band row': 'Back', 'resistance band pulldown': 'Back', 'resistance band pull-apart': 'Back', 'kettlebell swing': 'Back', 'kettlebell deadlift': 'Back', 'kettlebell row': 'Back', 'single arm kettlebell row': 'Back', 'kettlebell good morning': 'Back', 'sumo deadlift high pull': 'Back', 'medicine ball slam': 'Back', 'tire flip': 'Back', 'sled pull': 'Back', 'sled row': 'Back', 'rack chin': 'Back', 'weighted inverted row': 'Back', 'single arm inverted row': 'Back', 'smith machine row': 'Back', 'smith machine bent over row': 'Back', 'smith machine shrug': 'Back', 'cable face pull with external rotation': 'Back', 'seated rope row to neck': 'Back', 'j-pulldown': 'Back', 'half-kneeling single arm pulldown': 'Back', 'standing single arm pulldown': 'Back', 'lat prayer': 'Back', 'incline dumbbell shrug': 'Back', 'deadlift with chains': 'Back', 'deadlift with bands': 'Back', 'rack pull with chains': 'Back', 'rack pull with bands': 'Back', 'is Y-T-W-L': 'Back', 'scapular push-up': 'Back', 'prone y-raise': 'Back', 'prone t-raise': 'Back', 'prone w-raise': 'Back', 'prone l-raise': 'Back', 'quadruped row': 'Back', 'lawnmower pull': 'Back', 'alternating dumbbell row': 'Back', 'incline alternating dumbbell row': 'Back', 'single arm barbell landmine row': 'Back', 'squat': 'Legs', 'barbell squat': 'Legs', 'back squat': 'Legs', 'front squat': 'Legs', 'zercher squat': 'Legs', 'overhead squat': 'Legs', 'goblet squat': 'Legs', 'dumbbell squat': 'Legs', 'kettlebell squat': 'Legs', 'box squat': 'Legs', 'pause squat': 'Legs', 'tempo squat': 'Legs', 'safety bar squat': 'Legs', 'cambered bar squat': 'Legs', 'hack squat': 'Legs', 'barbell hack squat': 'Legs', 'machine hack squat': 'Legs', 'v-squat': 'Legs', 'sissy squat': 'Legs', 'bulgarian split squat': 'Legs', 'dumbbell bulgarian split squat': 'Legs', 'barbell bulgarian split squat': 'Legs', 'split squat': 'Legs', 'lunge': 'Legs', 'forward lunge': 'Legs', 'reverse lunge': 'Legs', 'walking lunge': 'Legs', 'lateral lunge': 'Legs', 'side lunge': 'Legs', 'curtsy lunge': 'Legs', 'dumbbell lunge': 'Legs', 'barbell lunge': 'Legs', 'overhead lunge': 'Legs', 'leg press': 'Legs', '45-degree leg press': 'Legs', 'horizontal leg press': 'Legs', 'vertical leg press': 'Legs', 'single leg press': 'Legs', 'wide stance leg press': 'Legs', 'narrow stance leg press': 'Legs', 'high foot placement leg press': 'Legs', 'low foot placement leg press': 'Legs', 'leg extension': 'Legs', 'single leg extension': 'Legs', 'leg curl': 'Legs', 'lying hamstring curl': 'Legs', 'seated hamstring curl': 'Legs', 'standing hamstring curl': 'Legs', 'nordic hamstring curl': 'Legs', 'glute-ham raise (ghr)': 'Legs', 'romanian deadlift (rdl)': 'Legs', 'barbell rdl': 'Legs', 'dumbbell rdl': 'Legs', 'single leg rdl': 'Legs', 'stiff-legged deadlift': 'Legs', 'barbell stiff-legged deadlift': 'Legs', 'dumbbell stiff-legged deadlift': 'Legs', 'good morning': 'Legs', 'barbell good morning': 'Legs', 'seated good morning': 'Legs', 'hip thrust': 'Legs', 'barbell hip thrust': 'Legs', 'dumbbell hip thrust': 'Legs', 'single leg hip thrust': 'Legs', 'machine hip thrust': 'Legs', 'banded hip thrust': 'Legs', 'glute bridge': 'Legs', 'weighted glute bridge': 'Legs', 'single leg glute bridge': 'Legs', 'frog pump': 'Legs', 'calf raise': 'Legs', 'standing calf raise': 'Legs', 'seated calf raise': 'Legs', 'donkey calf raise': 'Legs', 'leg press calf raise': 'Legs', 'smith machine calf raise': 'Legs', 'tibialis raise': 'Legs', 'adductor machine': 'Legs', 'abductor machine': 'Legs', 'cable pull-through': 'Legs', 'kettlebell swing': 'Legs', 'goblet swing': 'Legs', 'single arm kettlebell swing': 'Legs', 'step-up': 'Legs', 'dumbbell step-up': 'Legs', 'barbell step-up': 'Legs', 'box jump': 'Legs', 'seated box jump': 'Legs', 'depth jump': 'Legs', 'broad jump': 'Legs', 'pistol squat': 'Legs', 'shrimp squat': 'Legs', 'cossack squat': 'Legs', 'jefferson squat': 'Legs', 'anderson squat': 'Legs', 'sumo squat': 'Legs', 'dumbbell sumo squat': 'Legs', 'barbell sumo squat': 'Legs', 'landmine squat': 'Legs', 'belt squat': 'Legs', 'wall sit': 'Legs', 'weighted wall sit': 'Legs', 'sled push': 'Legs', 'sled drag': 'Legs', 'prowler push': 'Legs', 'tire flip': 'Legs', 'cyclist squat': 'Legs', 'spanish squat': 'Legs', 'reverse nordic curl': 'Legs', 'copenhagen plank': 'Legs', 'side-lying hip abduction': 'Legs', 'clam shell': 'Legs', 'fire hydrant': 'Legs', 'donkey kick': 'Legs', 'cable kickback': 'Legs', 'banded lateral walk': 'Legs', 'monster walk': 'Legs', 't-bar squat': 'Legs', 'hack squat deadlift': 'Legs', 'jump squat': 'Legs', 'barbell jump squat': 'Legs', 'dumbbell jump squat': 'Legs', 'lunge jump': 'Legs', 'split squat jump': 'Legs', 'skater squat': 'Legs', 'single leg box squat': 'Legs', 'thigh adductor': 'Legs', 'thigh abductor': 'Legs', 'reverse frog pump': 'Legs', 'hip extension machine': 'Legs', 'glute kickback machine': 'Legs', 'standing leg curl machine': 'Legs', 'lying leg curl machine': 'Legs', 'seated leg curl machine': 'Legs', 'resistance band leg extension': 'Legs', 'resistance band leg curl': 'Legs', 'resistance band hip thrust': 'Legs', 'resistance band glute bridge': 'Legs', 'resistance band squat': 'Legs', 'resistance band lunge': 'Legs', 'kettlebell goblet squat': 'Legs', 'kettlebell front squat': 'Legs', 'kettlebell lunge': 'Legs', 'kettlebell pistol squat': 'Legs', 'kettlebell sumo deadlift': 'Legs', 'medicine ball squat': 'Legs', 'medicine ball lunge': 'Legs', 'stability ball hamstring curl': 'Legs', 'stability ball wall squat': 'Legs', 'smith machine squat': 'Legs', 'smith machine lunge': 'Legs', 'smith machine split squat': 'Legs', 'smith machine good morning': 'Legs', 'cable hip abduction': 'Legs', 'cable hip adduction': 'Legs', 'cable glute kickback': 'Legs', 'barbell calf raise': 'Legs', 'dumbbell calf raise': 'Legs', 'single leg calf raise': 'Legs', 'jump rope': 'Legs', 'stair climbing': 'Legs', 'hill sprints': 'Legs', 'sprints': 'Legs', 'cycling': 'Legs', 'running': 'Legs', 'walking': 'Legs', 'hiking': 'Legs', 'elliptical': 'Legs', 'rowing machine': 'Legs', 'battle ropes': 'Legs', 'static lunge': 'Legs', 'front foot elevated split squat': 'Legs', 'rear foot elevated split squat': 'Legs', 'b-stance rdl': 'Legs', 'b-stance hip thrust': 'Legs', 'kas glute bridge': 'Legs', 'bodyweight squat': 'Legs', 'air squat': 'Legs', 'bodyweight lunge': 'Legs', 'bodyweight calf raise': 'Legs', 'bodyweight glute bridge': 'Legs', 'patrick step': 'Legs', 'poliquin step-up': 'Legs', 'single leg leg press': 'Legs', 'duck stance leg press': 'Legs', 'frog stance leg press': 'Legs', 'reverse v-squat': 'Legs', 'barbell front foot elevated split squat': 'Legs', 'dumbbell front foot elevated split squat': 'Legs', 'cable bulgarian split squat': 'Legs', 'landmine rdl': 'Legs', 'landmine reverse lunge': 'Legs', 'landmine lateral lunge': 'Legs', 'banded good morning': 'Legs', 'banded pull through': 'Legs', 'banded leg press': 'Legs', 'banded terminal knee extension (tke)': 'Legs', 'seated calf stretch': 'Legs', 'standing calf stretch': 'Legs', 'hamstring stretch': 'Legs', 'quad stretch': 'Legs', 'pigeon pose': 'Legs', 'butterfly stretch': 'Legs', 'frog stretch': 'Legs', 'overhead press (ohp)': 'Shoulders', 'barbell overhead press': 'Shoulders', 'military press': 'Shoulders', 'strict press': 'Shoulders', 'dumbbell overhead press': 'Shoulders', 'seated barbell press': 'Shoulders', 'seated dumbbell press': 'Shoulders', 'arnold press': 'Shoulders', 'push press': 'Shoulders', 'behind the neck press': 'Shoulders', 'smith machine overhead press': 'Shoulders', 'machine shoulder press': 'Shoulders', 'landmine press': 'Shoulders', 'single arm landmine press': 'Shoulders', 'kneeling landmine press': 'Shoulders', 'lateral raise': 'Shoulders', 'dumbbell lateral raise': 'Shoulders', 'cable lateral raise': 'Shoulders', 'machine lateral raise': 'Shoulders', 'single arm dumbbell lateral raise': 'Shoulders', 'single arm cable lateral raise': 'Shoulders', 'leaning lateral raise': 'Shoulders', 'egyptian lateral raise': 'Shoulders', 'front raise': 'Shoulders', 'dumbbell front raise': 'Shoulders', 'barbell front raise': 'Shoulders', 'plate front raise': 'Shoulders', 'cable front raise': 'Shoulders', 'alternating dumbbell front raise': 'Shoulders', 'rear delt fly': 'Shoulders', 'reverse pec deck': 'Shoulders', 'machine rear delt fly': 'Shoulders', 'bent over dumbbell fly': 'Shoulders', 'bent over cable fly': 'Shoulders', 'face pull': 'Shoulders', 'rope face pull': 'Shoulders', 'band face pull': 'Shoulders', 'upright row': 'Shoulders', 'barbell upright row': 'Shoulders', 'dumbbell upright row': 'Shoulders', 'cable upright row': 'Shoulders', 'ez bar upright row': 'Shoulders', 'high pull': 'Shoulders', 'snatch grip high pull': 'Shoulders', 'clean grip high pull': 'Shoulders', 'bus driver': 'Shoulders', 'plate steering wheel': 'Shoulders', 'scott press': 'Shoulders', 'z press': 'Shoulders', 'barbell z press': 'Shoulders', 'dumbbell z press': 'Shoulders', 'viking press': 'Shoulders', 'handstand push-up': 'Shoulders', 'wall-assisted handstand push-up': 'Shoulders', 'freestanding handstand push-up': 'Shoulders', 'pike push-up': 'Shoulders', 'feet-elevated pike push-up': 'Shoulders', 'band pull-apart': 'Shoulders', 'w-raise': 'Shoulders', 'y-raise': 'Shoulders', 't-raise': 'Shoulders', 'l-raise': 'Shoulders', 'cuban press': 'Shoulders', 'dumbbell cuban press': 'Shoulders', 'external rotation': 'Shoulders', 'cable external rotation': 'Shoulders', 'dumbbell external rotation': 'Shoulders', 'internal rotation': 'Shoulders', 'cable internal rotation': 'Shoulders', 'dumbbell internal rotation': 'Shoulders', 'bottoms-up kettlebell press': 'Shoulders', 'kettlebell press': 'Shoulders', 'single arm kettlebell press': 'Shoulders', 'double kettlebell press': 'Shoulders', 'see-saw press': 'Shoulders', 'bradford press': 'Shoulders', 'rocky press': 'Shoulders', 'powell raise': 'Shoulders', 'lu raise': 'Shoulders', 'side-lying external rotation': 'Shoulders', 'scaption': 'Shoulders', 'dumbbell scaption': 'Shoulders', 'cable scaption': 'Shoulders', 'full can lateral raise': 'Shoulders', 'empty can lateral raise': 'Shoulders', 'resistance band overhead press': 'Shoulders', 'resistance band lateral raise': 'Shoulders', 'resistance band front raise': 'Shoulders', 'resistance band pull-apart': 'Shoulders', 'resistance band face pull': 'Shoulders', 'isometric shoulder press hold': 'Shoulders', 'isometric lateral raise hold': 'Shoulders', 'isometric front raise hold': 'Shoulders', 'wall slide': 'Shoulders', 'thoracic rotation': 'Shoulders', 'shoulder circle': 'Shoulders', 'arm circle': 'Shoulders', 'pendulum swing': 'Shoulders', 'cross-body stretch': 'Shoulders', 'doorway stretch': 'Shoulders', 'child\'s pose': 'Shoulders', 'seated Arnold press': 'Shoulders', 'standing Arnold press': 'Shoulders', 'single arm Arnold press': 'Shoulders', 'alternating Arnold press': 'Shoulders', 'machine shoulder press (neutral grip)': 'Shoulders', 'machine shoulder press (pronated grip)': 'Shoulders', 'iso-lateral shoulder press': 'Shoulders', 'converging shoulder press': 'Shoulders', 'cable Y-raise': 'Shoulders', 'incline Y-raise': 'Shoulders', 'prone Y-raise': 'Shoulders', 'prone T-raise': 'Shoulders', 'prone W-raise': 'Shoulders', '6-way raise': 'Shoulders', 'kettlebell halo': 'Shoulders', 'turkish get-up': 'Shoulders', 'windmill': 'Shoulders', 'kettlebell windmill': 'Shoulders', 'dumbbell windmill': 'Shoulders', 'barbell jammer press': 'Shoulders', 'landmine clean and press': 'Shoulders', 'single arm push press': 'Shoulders', 'dumbbell push press': 'Shoulders', 'kettlebell push press': 'Shoulders', 'log press': 'Shoulders', 'axle press': 'Shoulders', 'circus dumbbell press': 'Shoulders', 'bicep curl': 'Arms', 'barbell curl': 'Arms', 'standing barbell curl': 'Arms', 'ez bar curl': 'Arms', 'dumbbell curl': 'Arms', 'standing dumbbell curl': 'Arms', 'alternating dumbbell curl': 'Arms', 'seated dumbbell curl': 'Arms', 'incline dumbbell curl': 'Arms', 'concentration curl': 'Arms', 'preacher curl': 'Arms', 'barbell preacher curl': 'Arms', 'dumbbell preacher curl': 'Arms', 'machine preacher curl': 'Arms', 'hammer curl': 'Arms', 'dumbbell hammer curl': 'Arms', 'rope hammer curl': 'Arms', 'cross body hammer curl': 'Arms', 'cable curl': 'Arms', 'standing cable curl': 'Arms', 'high cable curl': 'Arms', 'reverse curl': 'Arms', 'barbell reverse curl': 'Arms', 'dumbbell reverse curl': 'Arms', 'zottoman curl': 'Arms', 'spider curl': 'Arms', 'barbell spider curl': 'Arms', 'dumbbell spider curl': 'Arms', 'drag curl': 'Arms', 'barbell drag curl': 'Arms', 'dumbbell drag curl': 'Arms', 'waiter\'s curl': 'Arms', '21s curl': 'Arms', 'tricep extension': 'Arms', 'overhead tricep extension': 'Arms', 'barbell overhead tricep extension': 'Arms', 'dumbbell overhead tricep extension': 'Arms', 'single dumbbell overhead extension': 'Arms', 'cable overhead tricep extension': 'Arms', 'rope overhead tricep extension': 'Arms', 'tricep pushdown': 'Arms', 'v-bar pushdown': 'Arms', 'rope pushdown': 'Arms', 'straight bar pushdown': 'Arms', 'single arm pushdown': 'Arms', 'reverse grip pushdown': 'Arms', 'skull crusher': 'Arms', 'barbell skull crusher': 'Arms', 'ez bar skull crusher': 'Arms', 'dumbbell skull crusher': 'Arms', 'incline skull crusher': 'Arms', 'decline skull crusher': 'Arms', 'tricep kickback': 'Arms', 'dumbbell kickback': 'Arms', 'cable kickback': 'Arms', 'dip': 'Arms', 'bench dip': 'Arms', 'parallel bar dip': 'Arms', 'weighted dip': 'Arms', 'machine dip': 'Arms', 'close grip bench press': 'Arms', 'diamond push-up': 'Arms', 'forearm curl': 'Arms', 'wrist curl': 'Arms', 'barbell wrist curl': 'Arms', 'dumbbell wrist curl': 'Arms', 'reverse wrist curl': 'Arms', 'barbell reverse wrist curl': 'Arms', 'dumbbell reverse wrist curl': 'Arms', 'farmer\'s carry': 'Arms', 'plate pinch': 'Arms', 'tate press': 'Arms', 'jm press': 'Arms', 'california press': 'Arms', 'bodyweight tricep extension': 'Arms', 'trx tricep extension': 'Arms', 'ring dip': 'Arms', 'floor press (close grip)': 'Arms', 'pin press (close grip)': 'Arms', 'board press (close grip)': 'Arms', 'banded tricep pushdown': 'Arms', 'banded overhead extension': 'Arms', 'kettlebell tricep extension': 'Arms', 'rolling dumbbell extension': 'Arms', 'cross-body tricep extension': 'Arms', 'seated tricep press machine': 'Arms', 'iso-lateral tricep extension': 'Arms', 'reverse preacher curl': 'Arms', 'incline hammer curl': 'Arms', 'cable concentration curl': 'Arms', 'bayesian curl': 'Arms', 'pelican curl': 'Arms', 'behind the back cable curl': 'Arms', 'standing one-arm cable curl': 'Arms', 'seated alternating dumbbell curl': 'Arms', 'seated hammer curl': 'Arms', 'incline alternating dumbbell curl': 'Arms', 'preacher hammer curl': 'Arms', 'resistance band bicep curl': 'Arms', 'resistance band hammer curl': 'Arms', 'resistance band tricep pushdown': 'Arms', 'resistance band overhead extension': 'Arms', 'resistance band kickback': 'Arms', 'isometric bicep curl hold': 'Arms', 'isometric tricep extension hold': 'Arms', 'chin-up (underhand grip)': 'Arms', 'neutral grip pull-up': 'Arms', 'towel curl': 'Arms', 'fat gripz curl': 'Arms', 'fat gripz tricep extension': 'Arms', 'wrist roller': 'Arms', 'ulnar deviation': 'Arms', 'radial deviation': 'Arms', 'finger curl': 'Arms', 'grip crusher': 'Arms', 'dead hang': 'Arms', 'barbell hold': 'Arms', 'dumbbell hold': 'Arms', 'static hold chin-up': 'Arms', 'static hold dip': 'Arms', 'close grip push-up': 'Arms', 'one-arm push-up': 'Arms', 'tricep dip on rings': 'Arms', 'tricep dip on floor': 'Arms', 'tiger bend push-up': 'Arms', 'body-up': 'Arms', 'dumbbell preacher hammer curl': 'Arms', 'cable reverse grip curl': 'Arms', 'cable hammer curl': 'Arms', 'single arm cable preacher curl': 'Arms', 'single arm incline dumbbell curl': 'Arms', 'single arm concentration curl': 'Arms', 'decline dumbbell curl': 'Arms', 'lying cable curl': 'Arms', 'lying high cable curl': 'Arms', 'smith machine close grip bench press': 'Arms', 'smith machine drag curl': 'Arms', 'decline close grip bench press': 'Arms', 'incline close grip bench press': 'Arms', 'dumbbell floor press (close grip)': 'Arms', 'kettlebell skull crusher': 'Arms', 'band assisted dip': 'Arms', 'band resisted dip': 'Arms', 'band assisted chin-up': 'Arms', 'band resisted curl': 'Arms', 'cable wrist curl': 'Arms', 'cable reverse wrist curl': 'Arms', 'behind the back wrist curl': 'Arms', 'pronated wrist curl': 'Arms', 'supinated wrist curl': 'Arms', 'crunch': 'Core', 'bicycle crunch': 'Core', 'reverse crunch': 'Core', 'cable crunch': 'Core', 'machine crunch': 'Core', 'oblique crunch': 'Core', 'side crunch': 'Core', 'decline crunch': 'Core', 'weighted crunch': 'Core', 'plank': 'Core', 'side plank': 'Core', 'reverse plank': 'Core', 'rkc plank': 'Core', 'weighted plank': 'Core', 'plank with arm raise': 'Core', 'plank with leg raise': 'Core', 'plank jack': 'Core', 'plank walkout': 'Core', 'body saw': 'Core', 'leg raise': 'Core', 'hanging leg raise': 'Core', 'captain\'s chair leg raise': 'Core', 'lying leg raise': 'Core', 'decline leg raise': 'Core', 'flutter kick': 'Core', 'scissor kick': 'Core', 'heel tap': 'Core', 'toe touch': 'Core', 'v-up': 'Core', 'tuck-up': 'Core', 'hollow body hold': 'Core', 'arch hold': 'Core', 'superman': 'Core', 'bird dog': 'Core', 'dead bug': 'Core', 'russian twist': 'Core', 'weighted russian twist': 'Core', 'medicine ball twist': 'Core', 'wood chopper': 'Core', 'cable wood chopper': 'Core', 'dumbbell wood chopper': 'Core', 'reverse wood chopper': 'Core', 'side bend': 'Core', 'dumbbell side bend': 'Core', 'cable side bend': 'Core', 'ab wheel rollout': 'Core', 'barbell rollout': 'Core', 'stability ball rollout': 'Core', 'hanging knee raise': 'Core', 'hanging windshield wiper': 'Core', 'lying windshield wiper': 'Core', 'l-sit': 'Core', 'dragon flag': 'Core', 'human flag': 'Core', 'front lever': 'Core', 'back lever': 'Core', 'mountain climber': 'Core', 'cross-body mountain climber': 'Core', 'spiderman plank': 'Core', 'stir the pot': 'Core', 'pallof press': 'Core', 'cable pallof press': 'Core', 'band pallof press': 'Core', 'landmine anti-rotation': 'Core', 'landmine rainbow': 'Core', 'medicine ball slam': 'Core', 'side slam': 'Core', 'turkish get-up': 'Core', 'windmill': 'Core', 'side plank with rotation': 'Core', 'side plank with hip dip': 'Core', 'cable reverse crunch': 'Core', 'decline reverse crunch': 'Core', 'vertical leg crunch': 'Core', 'frog crunch': 'Core', 'long arm crunch': 'Core', 'jackknife sit-up': 'Core', 'sit-up': 'Core', 'weighted sit-up': 'Core', 'decline sit-up': 'Core', 'ghd sit-up': 'Core', 'stability ball crunch': 'Core', 'stability ball pike': 'Core', 'inchworm': 'Core', 'bear crawl': 'Core', 'cable lift': 'Core', 'cable chop': 'Core', 'standing ab rollout': 'Core', 'kneeling ab rollout': 'Core' };
const achievements = { 'first_workout': { name: 'System Activated', desc: 'Complete your first workout and awaken your potential.', icon: '🔑' }, 'first_metric': { name: 'Status Window', desc: 'Log your body metrics for the first time.', icon: '📊' }, '5_day_streak': { name: 'Daily Quest: Complete', desc: 'Maintain a 5-day workout streak. [Reward: Constitution +1]', icon: '📜' }, '10_workouts': { name: 'Persistent Effort', desc: 'Log 10 workouts. The path of the weak is to become strong.', icon: '🔥' }, '10000_kg_volume': { name: 'Strength of the Pack', desc: 'Lift a total of 10,000 kg. [Reward: Strength +1]', icon: '🐺' }, '5_templates': { name: 'Skill: [Routine Creation]', desc: 'Create 5 workout templates to optimize your growth.', icon: '✨' }, '50_workouts': { name: 'Seasoned Hunter', desc: 'Log 50 workouts. You are no longer a novice.', icon: '⚔️' }, '100000_kg_volume': { name: 'Overwhelming Power', desc: 'Lift a total of 100,000 kg. [Reward: Strength +5]', icon: '💥' }, '30_day_streak': { name: 'Title: [Perseverance]', desc: 'Maintain a 30-day workout streak. A title granted to the truly dedicated.', icon: '🎖️' }, '100_workouts': { name: 'Elite', desc: 'Log 100 workouts. Your presence is now palpable.', icon: '🛡️' }, '500000_kg_volume': { name: 'A-Rank Strength', desc: 'Lift a total of 500,000 kg. Your power rivals the strongest.', icon: '🦁' }, '10_templates': { name: 'Skill: [Advanced Tactics]', desc: 'Create 10 workout templates. Your strategies are refined.', icon: '🧠' }, '200_workouts': { name: 'The Strongest', desc: 'Log 200 workouts. You stand among the top hunters.', icon: '👑' }, '1000000_kg_volume': { name: 'Monarch\'s Might', desc: 'Lift a total of 1,000,000 kg. [Reward: Agility +10, Strength +10]', icon: '🌌' }, '90_day_streak': { name: 'Title: [Unbreakable Will]', desc: 'Maintain a 90-day workout streak. Your spirit cannot be broken.', icon: '💎' }, '365_workouts': { name: 'National Level Hunter', desc: 'Log 365 workouts. A full year of dedication.', icon: '🌍' }, '5000000_kg_volume': { name: 'Architect\'s Design', desc: 'Lift a total of 5,000,000 kg. You can reshape the very world.', icon: '🪐' }, 'analyze_week': { name: 'Skill: [Ruler\'s Authority]', desc: 'Use the AI analysis for the first time to gain insight. [Reward: Intelligence +5]', icon: '👁️' }, 'all_badges': { name: 'Job Change: The Monarch', desc: 'Unlock all other achievements. Arise.', icon: '💀' } };


// --- API INTERFACE ---
const api = {
    getWorkouts: async () => {
        const res = await fetch(`${API_BASE_URL}/api/workouts`, { headers: { 'Authorization': `Bearer ${AppState.token}` } });
        if (!res.ok) throw new Error('Could not fetch workout data.');
        return res.json();
    },
    saveWorkout: async (workoutData) => {
        const hasId = !!workoutData._id;
        const url = hasId ? `${API_BASE_URL}/api/workouts/${workoutData._id}` : `${API_BASE_URL}/api/workouts`;
        const method = hasId ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${AppState.token}` },
            body: JSON.stringify(workoutData),
        });
        if (!res.ok) throw new Error(`Failed to ${hasId ? 'update' : 'save'} workout`);
        return res.json();
    },
    deleteWorkout: async (workoutId) => {
        const res = await fetch(`${API_BASE_URL}/api/workouts/${workoutId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${AppState.token}` }
        });
        if (!res.ok) throw new Error('Failed to delete workout.');
        return res.json();
    },
    callGemini: async (prompt) => {
        const res = await fetch(`${API_BASE_URL}/api/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${AppState.token}` },
            body: JSON.stringify({ prompt }),
        });
        if (!res.ok) throw new Error('Failed to contact AI service.');
        const result = await res.json();
        return result.candidates?.[0]?.content.parts?.[0]?.text || "No response from AI.";
    }
};

// --- LOCAL STORAGE (For Templates) ---
const templateStorage = {
    get: () => JSON.parse(localStorage.getItem('auraflex_templates')) || [],
    set: (data) => localStorage.setItem('auraflex_templates', JSON.stringify(data)),
};

// --- UTILITIES ---
const utils = {
    toggleModal: (modal, show) => {
        if (!modal) return;
        modal.classList.toggle('hidden', !show);
        modal.classList.toggle('flex', show);
    },
    formatNumber: (num) => new Intl.NumberFormat().format(Math.round(num)),
    debounce: (func, delay) => {
        let timeout;
        const debounced = (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
        debounced.cancel = () => clearTimeout(timeout);
        return debounced;
    },
};

// --- ANALYTICS ---
const analytics = {
    calculateStreak: () => {
        const completed = state.workouts.filter(w => w.status === 'completed');
        if (completed.length === 0) return 0;
        const workoutDates = [...new Set(completed.map(w => new Date(w.date).toISOString().slice(0, 10)))]
            .sort((a, b) => new Date(b) - new Date(a));
        let streak = 0;
        const today = new Date(); today.setUTCHours(0, 0, 0, 0);
        const lastWorkoutDate = new Date(workoutDates[0]); lastWorkoutDate.setUTCHours(0, 0, 0, 0);
        const diffDays = (today - lastWorkoutDate) / (1000 * 3600 * 24);
        if (diffDays <= 1) {
            streak = 1;
            for (let i = 0; i < workoutDates.length - 1; i++) {
                const current = new Date(workoutDates[i]);
                const next = new Date(workoutDates[i + 1]);
                const dayDiff = (current - next) / (1000 * 3600 * 24);
                if (dayDiff === 1) streak++;
                else break;
            }
        }
        return streak;
    },
    calculateFrequency: () => {
        const oneMonthAgo = new Date(); oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const workoutsThisMonth = state.workouts.filter(w => w.status === 'completed' && new Date(w.date) >= oneMonthAgo).length;
        return (workoutsThisMonth / 4).toFixed(1);
    }
};

// --- RENDER FUNCTIONS ---
const render = {
    all: () => {
        render.summary();
        render.workoutList();
        render.templateList();
        render.logWorkoutButton();
        charts.updateAll();
    },
    summary: () => {
        const completedWorkouts = state.workouts.filter(w => w.status === 'completed');
        dom.summaryTotalWorkouts.textContent = completedWorkouts.length;
        const totalVolume = completedWorkouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0);
        dom.summaryTotalVolume.textContent = utils.formatNumber(totalVolume);
        dom.consistencyStreak.innerHTML = `🔥 ${analytics.calculateStreak()} Days`;
        dom.consistencyFrequency.textContent = `${analytics.calculateFrequency()} workouts/week`;
    },
    logWorkoutButton: () => {
        const inProgress = state.workouts.some(w => w.status === 'in-progress');
        const btnText = dom.logWorkoutBtn.querySelector('span');
        if (inProgress) {
            btnText.textContent = "Continue Workout";
            dom.logWorkoutBtn.classList.add('bg-orange-500', 'hover:bg-orange-600');
            dom.logWorkoutBtn.classList.remove('bg-yellow-400', 'hover:bg-yellow-500');
        } else {
            btnText.textContent = "+ Log New Workout";
            dom.logWorkoutBtn.classList.remove('bg-orange-500', 'hover:bg-orange-600');
            dom.logWorkoutBtn.classList.add('bg-yellow-400', 'hover:bg-yellow-500');
        }
    },
    workoutList: () => {
        const completed = state.workouts.filter(w => {
            if (w.status !== 'completed') return false;
            const workoutDate = new Date(w.date).toISOString().slice(0, 10);
            if (state.filter.startDate && workoutDate < state.filter.startDate) return false;
            if (state.filter.endDate && workoutDate > state.filter.endDate) return false;
            return true;
        });
        dom.workoutListContainer.innerHTML = completed.length ? completed.map(workout => `
            <div class="bg-[#0D0D0D] p-4 rounded-lg accordion-item" data-id="${workout._id}">
                <div class="accordion-header flex justify-between items-center cursor-pointer">
                    <p class="font-bold">${new Date(workout.date).toLocaleDateString()}</p>
                    <span class="accordion-icon text-xl">▶</span>
                </div>
                <div class="accordion-content hidden mt-4 pt-4 border-t border-gray-700">
                    <ul class="space-y-2">
                        ${workout.exercises.map(ex => `<li><strong>${ex.name}:</strong> ${ex.sets.length} sets, ${ex.volume || 0}kg volume</li>`).join('')}
                    </ul>
                    <button class="delete-workout-btn mt-2 text-red-500 text-sm">Delete</button>
                </div>
            </div>
        `).join('') : '<p class="text-center text-gray-500">No workouts found for the selected date(s).</p>';
    },
    templateList: () => {
        dom.templatesListContainer.innerHTML = state.templates.length ? state.templates.map(t => `
            <div class="bg-[#0D0D0D] p-4 rounded-lg flex justify-between items-center" data-id="${t.id}">
                <p class="font-bold">${t.name}</p>
                <div>
                    <button class="start-template-btn btn-primary text-sm py-1 px-3 mr-2">Start</button>
                    <button class="delete-template-btn text-red-500">🗑️</button>
                </div>
            </div>
        `).join('') : '<p class="text-center text-gray-500">No templates created.</p>';
    },
    workoutForm: (workout) => {
        dom.workoutDate.valueAsDate = workout ? new Date(workout.date) : new Date();
        dom.exercisesContainer.innerHTML = '';
        const exercises = workout && workout.exercises.length > 0 ? workout.exercises : [{ name: '', sets: [{ weight: '', reps: '' }] }];
        exercises.forEach(render.exerciseForm);
    },
    exerciseForm: (exercise, index) => {
        const exerciseHtml = `
            <div class="exercise-group bg-[#0D0D0D] p-3 rounded-lg space-y-2" data-index="${index}">
                <div class="flex justify-between items-center mb-2">
                    <input type="text" placeholder="Exercise Name" class="w-full bg-transparent font-semibold text-lg focus:outline-none exercise-name" value="${exercise.name || ''}" required>
                    <button type="button" class="remove-exercise-btn text-red-500 p-1">🗑️</button>
                </div>
                <div class="sets-container space-y-2">
                    ${exercise.sets.map((set, setIndex) => render.setForm(set, setIndex)).join('')}
                </div>
                <button type="button" class="add-set-btn text-yellow-400 text-sm font-semibold mt-2">+ Add Set</button>
            </div>`;
        dom.exercisesContainer.insertAdjacentHTML('beforeend', exerciseHtml);
    },
    setForm: (set, index) => `
        <div class="set-group flex gap-2 items-center" data-index="${index}">
            <input type="number" placeholder="Weight" class="w-1/3 input-base set-weight" value="${set.weight || ''}">
            <input type="number" placeholder="Reps" class="w-1/3 input-base set-reps" value="${set.reps || ''}" required>
            <button type="button" class="remove-set-btn text-red-500">X</button>
        </div>`,
    templateExerciseInput: () => {
        const inputHTML = `<div class="flex items-center gap-2"><input type="text" placeholder="Exercise Name" class="template-exercise-name-input w-full input-base p-1.5" required><button type="button" class="remove-template-exercise-btn text-gray-400 hover:text-red-500">❌</button></div>`;
        dom.templateExercisesContainer.insertAdjacentHTML('beforeend', inputHTML);
    },
};

// --- CHARTS ---
const charts = {
    init: () => {
        Object.values(state.charts).forEach(c => c?.destroy());
        const chartOptions = { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } };
        if (dom.volumeChartCanvas) state.charts.volume = new Chart(dom.volumeChartCanvas.getContext('2d'), { type: 'bar', options: chartOptions });
        if (dom.intensityChartCanvas) state.charts.intensity = new Chart(dom.intensityChartCanvas.getContext('2d'), { type: 'line', options: chartOptions });
        if (dom.muscleGroupChartCanvas) state.charts.muscle = new Chart(dom.muscleGroupChartCanvas.getContext('2d'), { type: 'doughnut', options: { responsive: true, maintainAspectRatio: false } });
    },
    updateAll: () => {
        charts.updateVolume();
        charts.updateIntensity();
        charts.updateMuscleGroups();
    },
    updateVolume: () => {
        if (!state.charts.volume) return;
        const completed = state.workouts.filter(w => w.status === 'completed').sort((a, b) => new Date(a.date) - new Date(b.date));
        state.charts.volume.data = {
            labels: completed.map(w => new Date(w.date).toLocaleDateString('en-CA')),
            datasets: [{
                label: 'Total Volume (kg)',
                data: completed.map(w => w.totalVolume || 0),
                backgroundColor: '#FFC700',
            }]
        };
        state.charts.volume.update();
    },
    updateIntensity: () => {
        if (!state.charts.intensity) return;
        const completed = state.workouts.filter(w => w.status === 'completed').sort((a, b) => new Date(a.date) - new Date(b.date));
        const data = completed.map(w => {
            const totalReps = w.exercises.reduce((sum, ex) => sum + ex.sets.reduce((s, set) => s + (set.reps || 0), 0), 0);
            return totalReps > 0 ? ((w.totalVolume || 0) / totalReps) : 0;
        });
        state.charts.intensity.data = {
            labels: completed.map(w => new Date(w.date).toLocaleDateString('en-CA')),
            datasets: [{
                label: 'Average Intensity (kg/rep)',
                data: data,
                borderColor: '#3478F6',
                tension: 0.1
            }]
        };
        state.charts.intensity.update();
    },
    updateMuscleGroups: () => {
        if (!state.charts.muscle) return;
        const muscleVolumes = {};
        state.workouts.filter(w => w.status === 'completed').forEach(w => {
            w.exercises.forEach(ex => {
                let group = 'Other';
                const nameLower = ex.name.toLowerCase();
                for (const key in muscleGroupMapping) {
                    if (nameLower.includes(key)) {
                        group = muscleGroupMapping[key];
                        break;
                    }
                }
                muscleVolumes[group] = (muscleVolumes[group] || 0) + (ex.volume || 0);
            });
        });
        const labels = Object.keys(muscleVolumes).filter(k => muscleVolumes[k] > 0);
        const data = labels.map(k => muscleVolumes[k]);
        state.charts.muscle.data = {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#FFC700', '#3478F6', '#FF453A', '#34C759', '#AF52DE', '#FF9500', '#5856D6'],
                borderColor: '#1C1C1E',
                borderWidth: 4,
            }]
        };
        state.charts.muscle.update();
    }
};

// --- DEBOUNCED SAVE FOR IN-PROGRESS WORKOUTS ---
const debouncedSave = utils.debounce(async (workoutData) => {
    try {
        await api.saveWorkout(workoutData);
        console.log("In-progress workout auto-saved.");
    } catch (error) {
        console.error("Auto-save failed:", error);
        showToast('Auto-save failed. Check connection.', true);
    }
}, 1000);


// --- EVENT HANDLERS ---
const handlers = {
    setup: () => {
        dom.logWorkoutBtn.addEventListener('click', () => handlers.openWorkoutForm());
        dom.createTemplateBtn.addEventListener('click', handlers.openTemplateForm);
        dom.modalBg.addEventListener('click', () => utils.toggleModal(dom.workoutFormModal, false));
        dom.discardWorkoutBtn.addEventListener('click', handlers.discardWorkout);
        dom.workoutForm.addEventListener('submit', handlers.completeWorkout);
        dom.templateForm.addEventListener('submit', handlers.saveTemplate);
        dom.addTemplateExerciseBtn.addEventListener('click', render.templateExerciseInput);
        dom.templateExercisesContainer.addEventListener('click', handlers.handleTemplateFormClicks);
        dom.exercisesContainer.addEventListener('input', handlers.handleFormInput);
        dom.exercisesContainer.addEventListener('click', handlers.handleFormClicks);
        dom.workoutListContainer.addEventListener('click', handlers.handleListClicks);
        dom.templatesListContainer.addEventListener('click', handlers.handleTemplateClicks);
        dom.analyzeWeekBtn.addEventListener('click', handlers.analyzePerformance);
        dom.addExerciseBtn.addEventListener('click', handlers.addExercise);
        document.addEventListener('dateSelected', (e) => {
            const selectedDate = e.detail.date;
            state.filter.startDate = selectedDate;
            state.filter.endDate = selectedDate;
            dom.startDateInput.value = selectedDate;
            dom.endDateInput.value = selectedDate;
            render.workoutList();
        });
        dom.startDateInput.addEventListener('change', () => {
            state.filter.startDate = dom.startDateInput.value;
            render.workoutList();
        });
        dom.endDateInput.addEventListener('change', () => {
            state.filter.endDate = dom.endDateInput.value;
            render.workoutList();
        });
        // Calculator Handlers
        dom.calculatorAccordionHeader.addEventListener('click', handlers.toggleCalculator);
        dom.calculateBmi.addEventListener('click', handlers.calculateBmi);
        dom.calculateBmr.addEventListener('click', handlers.calculateBmr);
        dom.calculateTdee.addEventListener('click', handlers.calculateTdee);
        dom.calculateProtein.addEventListener('click', handlers.calculateProtein);
    },
    openWorkoutForm: async (templateExercises = []) => {
        let inProgress = state.workouts.find(w => w.status === 'in-progress');
        if (inProgress) {
            state.currentWorkout = { ...inProgress };
        } else {
            const newWorkout = {
                date: new Date().toISOString().slice(0, 10),
                exercises: templateExercises.length > 0 ? templateExercises.map(name => ({ name, sets: [{ weight: '', reps: '' }] })) : [{ name: '', sets: [{ weight: '', reps: '' }] }],
                status: 'in-progress',
                totalVolume: 0,
            };
            try {
                const saved = await api.saveWorkout(newWorkout);
                state.currentWorkout = { ...newWorkout, _id: saved.insertedId };
                await refreshAppState();
                state.workouts = AppState.workouts;
                render.logWorkoutButton();
            } catch (error) {
                showToast(error.message, true);
                return;
            }
        }
        render.workoutForm(state.currentWorkout);
        utils.toggleModal(dom.workoutFormModal, true);
    },
    addExercise: () => {
        if (!state.currentWorkout) return;
        const newExercise = { name: '', sets: [{ weight: '', reps: '' }] };
        state.currentWorkout.exercises.push(newExercise);
        render.exerciseForm(newExercise, state.currentWorkout.exercises.length - 1);
        debouncedSave({ ...state.currentWorkout });
    },
    handleFormInput: (e) => {
        if (!state.currentWorkout) return;
        const exerciseGroup = e.target.closest('.exercise-group');
        if (!exerciseGroup) return;
        
        const exerciseIndex = parseInt(exerciseGroup.dataset.index, 10);
        state.currentWorkout.exercises[exerciseIndex].name = exerciseGroup.querySelector('.exercise-name').value;
        state.currentWorkout.exercises[exerciseIndex].sets = [];
        exerciseGroup.querySelectorAll('.set-group').forEach(setGroup => {
            const weight = parseFloat(setGroup.querySelector('.set-weight').value) || 0;
            const reps = parseInt(setGroup.querySelector('.set-reps').value, 10) || 0;
            if (reps > 0) {
                state.currentWorkout.exercises[exerciseIndex].sets.push({ weight, reps });
            }
        });
        debouncedSave({ ...state.currentWorkout });
    },
    completeWorkout: async (e) => {
        e.preventDefault();
        debouncedSave.cancel();
        if (!state.currentWorkout) return;

        const workoutToSave = { ...state.currentWorkout };
        workoutToSave.status = 'completed';
        workoutToSave.totalVolume = 0;
        workoutToSave.exercises = workoutToSave.exercises.filter(ex => ex.name && ex.sets.length > 0);

        if (workoutToSave.exercises.length === 0) {
            showToast('Add at least one exercise.', true);
            return;
        }

        workoutToSave.exercises.forEach(ex => {
            ex.volume = ex.sets.reduce((vol, set) => vol + (set.weight * set.reps), 0);
            workoutToSave.totalVolume += ex.volume;
        });

        try {
            await api.saveWorkout(workoutToSave);
            showToast('Workout completed!');
            utils.toggleModal(dom.workoutFormModal, false);
            await init(true);
        } catch (error) {
            showToast(error.message, true);
        }
    },
    discardWorkout: async () => {
        if (state.currentWorkout && state.currentWorkout._id) {
            if (confirm("Are you sure you want to discard this in-progress workout?")) {
                try {
                    await api.deleteWorkout(state.currentWorkout._id);
                    await init(true);
                } catch (error) {
                    showToast(error.message, true);
                }
            }
        }
        utils.toggleModal(dom.workoutFormModal, false);
    },
    openTemplateForm: () => {
        dom.templateForm.reset();
        dom.templateExercisesContainer.innerHTML = '';
        render.templateExerciseInput();
        utils.toggleModal(dom.templateFormModal, true);
    },
    saveTemplate: (e) => {
        e.preventDefault();
        const name = dom.templateNameInput.value.trim();
        if (!name) return showToast('Template name is required.', true);
        const exercises = [...dom.templateExercisesContainer.querySelectorAll('.template-exercise-name-input')]
            .map(input => input.value.trim())
            .filter(Boolean);

        if (exercises.length === 0) {
            return showToast('Add at least one exercise to the template.', true);
        }

        const newTemplate = { id: Date.now(), name, exercises };
        state.templates.push(newTemplate);
        templateStorage.set(state.templates);
        render.templateList();
        utils.toggleModal(dom.templateFormModal, false);
        showToast('Template saved!');
    },
    handleTemplateFormClicks: (e) => {
        if (e.target.classList.contains('remove-template-exercise-btn')) {
            if (dom.templateExercisesContainer.children.length > 1) {
                e.target.parentElement.remove();
            } else {
                showToast('A template must have at least one exercise.', true);
            }
        }
    },
    handleListClicks: async (e) => {
        const item = e.target.closest('.accordion-item');
        if (!item) return;

        if (e.target.closest('.accordion-header')) {
            item.querySelector('.accordion-content').classList.toggle('hidden');
            item.querySelector('.accordion-icon').classList.toggle('rotate-90');
        }

        if (e.target.classList.contains('delete-workout-btn')) {
            const id = item.dataset.id;
            if (confirm('Are you sure you want to delete this workout?')) {
                try {
                    await api.deleteWorkout(id);
                    await init(true);
                    showToast('Workout deleted.');
                } catch (error) {
                    showToast(error.message, true);
                }
            }
        }
    },
    handleTemplateClicks: (e) => {
        const item = e.target.closest('[data-id]');
        if (!item) return;
        const id = parseInt(item.dataset.id, 10);
        if (e.target.classList.contains('delete-template-btn')) {
            state.templates = state.templates.filter(t => t.id !== id);
            templateStorage.set(state.templates);
            render.templateList();
        }
        if (e.target.classList.contains('start-template-btn')) {
            const template = state.templates.find(t => t.id === id);
            if (template) {
                handlers.openWorkoutForm(template.exercises);
            }
        }
    },
    handleFormClicks: (e) => {
        if (!state.currentWorkout) return;

        const addSetBtn = e.target.closest('.add-set-btn');
        if (addSetBtn) {
            const exerciseGroup = addSetBtn.closest('.exercise-group');
            const setsContainer = exerciseGroup.querySelector('.sets-container');
            setsContainer.insertAdjacentHTML('beforeend', render.setForm({}, setsContainer.children.length));
            return;
        }

        const removeSetBtn = e.target.closest('.remove-set-btn');
        if (removeSetBtn) {
            const setGroup = removeSetBtn.closest('.set-group');
            if (setGroup.parentElement.children.length > 1) {
                setGroup.remove();
            } else {
                showToast("Each exercise must have at least one set.", true);
            }
            return;
        }

        const removeExerciseBtn = e.target.closest('.remove-exercise-btn');
        if (removeExerciseBtn) {
            const exerciseGroup = removeExerciseBtn.closest('.exercise-group');
            if (dom.exercisesContainer.children.length > 1) {
                exerciseGroup.remove();
                dom.exercisesContainer.querySelectorAll('.exercise-group').forEach((group, index) => {
                    group.dataset.index = index;
                });
            } else {
                showToast("A workout must have at least one exercise.", true);
            }
            return;
        }
    },
    analyzePerformance: async () => {
        const responseDiv = dom.aiAnalysisResponse;
        responseDiv.classList.remove('hidden');
        responseDiv.innerHTML = '<div class="loader mx-auto"></div>';
        try {
            const recentWorkouts = state.workouts.filter(w => w.status === 'completed').slice(0, 5);
            if (recentWorkouts.length === 0) {
                responseDiv.innerHTML = '<p>Not enough data to analyze. Complete some workouts first!</p>';
                return;
            }
            const prompt = `Analyze my last ${recentWorkouts.length} workouts and provide feedback on consistency and volume trends. Suggest one area for improvement. My workouts: ${JSON.stringify(recentWorkouts.map(w=>({date:w.date, totalVolume:w.totalVolume})))}. Format as simple HTML with <h3> and <ul>.`;
            const analysis = await api.callGemini(prompt);
            responseDiv.innerHTML = analysis;
        } catch (error) {
            responseDiv.innerHTML = `<p class="text-red-500">${error.message}</p>`;
        }
    },
    toggleCalculator: () => {
        dom.calculatorAccordionContent.classList.toggle('hidden');
        dom.calculatorAccordionIcon.classList.toggle('rotate-90');
    },
    calculateBmi: () => {
        const weight = parseFloat(dom.bmiWeight.value);
        const height = parseFloat(dom.bmiHeight.value);
        if (weight > 0 && height > 0) {
            const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
            let category = '';
            if (bmi < 18.5) category = 'Underweight';
            else if (bmi < 24.9) category = 'Normal weight';
            else if (bmi < 29.9) category = 'Overweight';
            else category = 'Obesity';
            dom.bmiResult.innerHTML = `<p class="text-2xl font-bold">${bmi}</p><p class="text-gray-400">${category}</p>`;
        } else {
            dom.bmiResult.innerHTML = `<p class="text-red-400">Please enter valid weight and height.</p>`;
        }
    },
    calculateBmr: () => {
        const age = parseInt(dom.bmrAge.value);
        const gender = dom.bmrGender.value;
        const weight = parseFloat(dom.bmrWeight.value);
        const height = parseFloat(dom.bmrHeight.value);
        if (age > 0 && weight > 0 && height > 0) {
            let bmr = 0;
            if (gender === 'male') {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
            } else {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
            }
            dom.bmrResult.innerHTML = `<p class="text-2xl font-bold">${bmr.toFixed(0)}</p><p class="text-gray-400">calories/day</p>`;
        } else {
            dom.bmrResult.innerHTML = `<p class="text-red-400">Please fill all fields correctly.</p>`;
        }
    },
    calculateTdee: () => {
        const age = parseInt(dom.tdeeAge.value);
        const gender = dom.tdeeGender.value;
        const weight = parseFloat(dom.tdeeWeight.value);
        const height = parseFloat(dom.tdeeHeight.value);
        const activity = parseFloat(dom.tdeeActivity.value);
        if (age > 0 && weight > 0 && height > 0) {
            let bmr = 0;
            if (gender === 'male') {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
            } else {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
            }
            const tdee = bmr * activity;
            dom.tdeeResult.innerHTML = `<p class="text-2xl font-bold">${tdee.toFixed(0)}</p><p class="text-gray-400">calories/day to maintain</p>`;
        } else {
            dom.tdeeResult.innerHTML = `<p class="text-red-400">Please fill all fields correctly.</p>`;
        }
    },
    calculateProtein: () => {
        const weight = parseFloat(dom.proteinWeight.value);
        const activity = parseFloat(dom.proteinActivity.value);
        const goal = parseFloat(dom.proteinGoal.value);
        if (weight > 0) {
            const proteinIntake = weight * activity * goal;
            dom.proteinResult.innerHTML = `<p class="text-2xl font-bold">${proteinIntake.toFixed(0)}g</p><p class="text-gray-400">of protein/day</p>`;
        } else {
            dom.proteinResult.innerHTML = `<p class="text-red-400">Please enter a valid weight.</p>`;
        }
    },
};

// --- INITIALIZATION ---
const cacheDom = () => {
    const ids = ['log-workout-btn', 'summary-total-workouts', 'summary-total-volume', 'consistency-streak', 'consistency-frequency', 'analyze-week-btn', 'ai-analysis-response', 'volume-chart', 'intensity-chart', 'muscle-group-chart', 'workout-list-container', 'workout-form-modal', 'workout-form', 'workout-date', 'exercises-container', 'discard-workout-btn', 'search-input', 'start-date-input', 'end-date-input', 'create-template-btn', 'templates-list-container', 'template-form-modal', 'template-form', 'template-name-input', 'add-exercise-btn', 'add-template-exercise-btn', 'template-exercises-container', 'calculator-accordion-header', 'calculator-accordion-content', 'calculator-accordion-icon', 'calculate-bmi', 'bmi-weight', 'bmi-height', 'bmi-result', 'calculate-bmr', 'bmr-age', 'bmr-gender', 'bmr-weight', 'bmr-height', 'bmr-result', 'calculate-tdee', 'tdee-age', 'tdee-gender', 'tdee-weight', 'tdee-height', 'tdee-activity', 'tdee-result', 'calculate-protein', 'protein-weight', 'protein-activity', 'protein-goal', 'protein-result'];
    ids.forEach(id => {
        const key = id.replace(/-(\w)/g, (_, p1) => p1.toUpperCase());
        dom[key] = document.getElementById(id);
    });
    dom.modalBg = document.getElementById('modal-bg-overlay-workout');
};

async function init(isRefresh = false) {
    try {
        if (isRefresh) {
            await refreshAppState();
        }
        
        if (!isRefresh) {
            state.profile = AppState.profile;
            state.templates = templateStorage.get();
        }
        
        state.workouts = AppState.workouts;
        
        if (!isRefresh) {
            cacheDom();
            handlers.setup();
            charts.init();
        }
        
        render.all();
    } catch (error) {
        console.error("Failed to initialize workout page:", error);
        showToast(error.message, true);
    }
}

export default function initializeWorkoutPage() {
    if (AppState.isInitialized) {
        init();
    } else {
        document.addEventListener('app-initialized', init, { once: true });
    }
}

