import os

sequences = [ 'seq1_r1', 'seq1_r2', 'seq2_r1', 'seq2_r2', 'seq2_r3', 'seq2_r4', 'seq2_r5' ]
seq_stim_files = [ val + '.txt' for val in sequences ]

master_stimlist = os.listdir( 'gottsImages' )
stim_param = str( len( master_stimlist ) ) + ' '
for stim in master_stimlist: # caption
	name = stim.split( '.' )[ 0 ].split( '_' )[0]
	if name[0] == 'x': name = name[1:]
	stim_param += name.upper() + ' '

for stim in master_stimlist: # icon
	stim_param += os.path.join( 'images', 'ecog', 'gottsImages', stim ) + ' '

for stim in master_stimlist: # audio
	stim_param += '% ' 

print stim_param

for seq, filename in zip( sequences, seq_stim_files ):
	f = open( filename, 'r' )
	stimfiles = [ os.path.basename( line ).strip() for line in f ]
	f.close()
	sequence = str( len( stimfiles ) ) + ' '
	for stim in stimfiles:
		sequence += str( master_stimlist.index( stim ) + 1 ) + ' '
	print seq, ':', sequence + '\n'

	
